import express from 'express';
import path from 'path';
import userRoutes from './api/routes/userRoutes';

import { Request, Response } from 'express';
import mongoose, { FilterQuery, Query } from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './db';
import cors from 'cors';
import bodyParser from 'body-parser';
import './workers/workers';
import multer from 'multer';
import { Server } from 'socket.io';
import { CronJob } from 'cron';
import http from 'http';

import dayjs from 'dayjs';
import fetchMontlyTemperatureData from './utils/fetch-montly-temperature-data';
import fetchMonthlyHumidityData from './utils/fetch-monthly-humidity-data';
import WeatherData from './api/models/weather';
import fetchCloudCoverMonthlyData from './utils/fetch-cloud-cover-monthly-data';
import fetchWeatherSeasonData from './utils/fetch-weather-season-chart-data';
import verifyToken from './api/middleware/auth';
import { csvQueue, serverAdapter } from './queues/queue';
import { createWorker } from './workers/workers';

export enum TimeFrame {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface WeatherDataParams {
  page: number;
  limit: number;
  filter: string;
  sort: string;
  timeFrame: TimeFrame;
  dateFrom: string;
  dateTo: string;
}

dotenv.config();

const app = express();
const httpServer = http.createServer(app);
app.use(
  cors({
    origin: 'http://localhost:3000',
  })
);
const port = 5001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());

const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
  transports: ['websocket', 'polling'],
});

createWorker(io);

io.on('connection', (socket) => {
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
      const weatherSeasonChartData = await fetchWeatherSeasonData();

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
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

app.use('/user', userRoutes);

const MONGODBURI = process.env.MONGODB_URI;

const upload = multer({ dest: 'uploads/' });

app.get('/', (req: Request, res: Response) => {
  res.render('index', { user: req.user });
});

app.get('/protected', verifyToken, (req: Request, res: Response) => {
  res.status(200).json({ message: 'Protected route Accessed  Successfully' });
});

app.post(
  '/upload',
  upload.single('file'),
  async (req: Request, res: Response) => {
    const filePath = req.file!.path;

    try {
      const job = csvQueue.add('csv-job', { filePath });
      console.log('job', job);
      res.status(200).json({ message: 'File upload started!' });
    } catch (error) {
      res.status(500).json({ message: 'Error uploading file' });
    }
  }
);

app.use('/admin/queues', serverAdapter.getRouter());

connectDb();

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
