import express from 'express';
import { Request, Response } from 'express';
import mongoose, { FilterQuery, Query } from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import { Server } from 'socket.io';
import { CronJob } from 'cron';
import http from 'http';

import dayjs from 'dayjs';
import userRoutes from './api/routes/userRoutes.js';
import connectDb from './db.js';
import { createWorker } from './workers/workers.js';
import fetchCloudCoverMonthlyData from './utils/fetch-cloud-cover-monthly-data.js';
import fetchMontlyTemperatureData from './utils/fetch-montly-temperature-data.js';
import fetchMonthlyHumidityData from './utils/fetch-monthly-humidity-data.js';
import { csvQueue, serverAdapter } from './queues/queue.js';
import fetchWeatherSeasonChart from './utils/fetch-weather-season-chart-data.js';
import WeatherData from './api/models/weather.js';
import verifyToken from './api/middleware/auth.js';
import { WeatherDataParams } from './types/dashboard.js';
import fs from 'fs';

dotenv.config();
const app = express();
const path = 'uploads';

if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}

const upload = multer({ dest: path });

const httpServer = http.createServer(app);

if (!process.env.FRONTEND_URL) {
  throw new Error('FRONTEND_URL variable is not defined');
}

const allowedOrigins = [process.env.FRONTEND_URL, 'http://localhost:3000'];

console.log('allowed origins', allowedOrigins);

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
const port = process.env.PORT || 5001;

const io = new Server(httpServer, {
  path: '/socket.io/',
  cors: {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
});

io.engine.on('connection_error', (err) => {
  console.log('Connection error:', err);
});

createWorker(io);

io.on('connection', (socket) => {
  // eslint-disable-next-line no-console
  console.log('client connected', socket.id);

  socket.on('fetchCloudCoverData', async () => {
    try {
      const cloudCoverData = await fetchCloudCoverMonthlyData();
      socket.emit('cloudCoverData', cloudCoverData);
    } catch (error) {
      console.error('Error fetching cloud cover data:', error);
      socket.emit('error', { message: 'Failed to fetch cloud cover data' });
    }
  });
  socket.on('fetchMonthlyTemperatureData', async () => {
    try {
      const monthlyTemperatureData = await fetchMontlyTemperatureData();

      socket.emit('monthlyTemperatureData', monthlyTemperatureData);
    } catch (error) {
      console.error('Error fetching monthly temperature data:', error);
      socket.emit('error', {
        message: 'Failed to fetch monthly temperature data',
      });
    }
  });
  socket.on('fetchMonthlyHumidityData', async () => {
    try {
      const monthlyHumidityData = await fetchMonthlyHumidityData();

      socket.emit('monthlyHumidityData', monthlyHumidityData);
    } catch (error) {
      console.error('Error fetching monthly humidity data:', error);
      socket.emit('error', {
        message: 'Failed to fetch monthly humidity data',
      });
    }
  });
  socket.on('fetchWeatherSeasonChartData', async () => {
    try {
      const weatherSeasonChartData = await fetchWeatherSeasonChart();

      socket.emit('weatherSeasonChartData', weatherSeasonChartData);
    } catch (error) {
      console.error('Error fetching monthly humidity data:', error);
      socket.emit('error', {
        message: 'Failed to fetch monthly humidity data',
      });
    }
  });

  socket.on('fetchData', async (params: WeatherDataParams) => {
    const { page = 1, limit = 10, dateFrom, dateTo, sort } = params;

    try {
      const totalCount = await WeatherData.countDocuments();

      const query: any = {};

      if (dateFrom || dateTo) {
        query.time = {};
        if (dateFrom) query.time.$gte = dateFrom;
        if (dateTo) query.time.$lte = dateTo;
      }

      const filteredCount = await WeatherData.countDocuments(query);

      const data = await WeatherData.find(query)
        .sort({ time: sort === 'desc' ? -1 : 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();

      socket.emit('data', {
        data,
        pagination: {
          total: filteredCount,
          page,
          limit,
          pages: Math.ceil(filteredCount / limit),
        },
      });
    } catch (error) {
      console.error('Error fetching data:', error);
      socket.emit('error', {
        message: 'Failed to fetch data',
        error: (error as Error).message,
      });
    }
  });

  socket.on('cancelUploadJob', async (jobId) => {
    try {
      const job = await csvQueue.getJob(jobId);

      if (!job) {
        throw new Error('Job not found with id ' + jobId);
      }

      await job.remove();

      socket.emit('jobCancelled', jobId);
    } catch (error) {
      socket.emit('jobCancelledFailed', error);
    }
  });
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use('/user', userRoutes);

const MONGODBURI = process.env.MONGODB_URI;

app.get('/', (req: Request, res: Response) => {
  res.render('index.ejs');
});

app.post(
  '/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const filePath = req.file.path;

    try {
      const job = await csvQueue.add(
        'csv-job',
        { filePath },
        {
          attempts: 3,
          backoff: { type: 'fixed', delay: 10000 },
          removeOnComplete: false,
        }
      );
      console.log('after job creation');

      console.log('Job created:', {
        jobId: job.id,
        filePath,
        timestamp: new Date().toISOString(),
      });

      res.status(200).json({
        message: 'File upload started!',
        jobId: job.id,
      });
      return;
    } catch (error) {
      console.error('Error creating job:', error);
      res.status(500).json({
        message: 'Error uploading file',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      return;
    }
  }
);
app.use('/admin/queues', serverAdapter.getRouter());

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res
      .status(500)
      .json({ message: 'Internal Server Error', error: err.message });
  }
);

connectDb();

app.options('/user/login', (req, res) => {
  console.log('Received OPTIONS request for /user/login');
  res.send(); // Send a response for the preflight check
});

httpServer
  .listen(port, () => {
    console.log(`Server running on port ${port}`);
  })
  .on('error', (err) => {
    console.error('Server error:', err);
  });
