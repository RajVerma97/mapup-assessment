import express from 'express';
import path from 'path';
import userRoutes from './api/routes/userRoutes';

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './db';
import verifyToken from './api/middleware/auth';
import cors from 'cors';
import bodyParser from 'body-parser';
import { csvQueue, serverAdapter } from './queues/queue';
import './workers/workers';
import multer from 'multer';
import WeatherData from './api/models/weather';
import { Server } from 'socket.io';
import { CronJob } from 'cron';
import http from 'http';
import fetchCloudCoverMonthlyData from './utils/fetch-cloud-cover-monthly-data';
import fetchMontlyTemperatureData from './utils/fetch-montly-temperature-data';
import fetchMonthlyHumidityData from './utils/fetch-monthly-humidity-data';
import fetchWeatherSeasonData from './utils/fetch-weather-season-chart-data';

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

// io.on('connection', async (socket) => {
//   const job = new CronJob('*/5 * * * * *', async (params) => {
//     const { page, limit, filter, sort } = params;
//     const query = WeatherData.find();

//     if (sort) {
//       query.sort({ time: sort === 'asc' ? 1 : -1 });
//     }
//     const data = await query
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .exec();
//     socket.emit('time', data);
//   });

//   job.start();

//   socket.on('disconnect', () => {
//     job.stop();
//   });
// });
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('fetchCloudCoverData', async () => {
    console.log('Received request for cloud cover data');
    try {
      const cloudCoverData = await fetchCloudCoverMonthlyData();
      // console.log('Sending cloud cover data:', cloudCoverData);
      socket.emit('cloudCoverData', cloudCoverData);
    } catch (error) {
      console.error('Error fetching cloud cover data:', error);
      socket.emit('error', { message: 'Failed to fetch cloud cover data' });
    }
  });
  socket.on('fetchMonthlyTemperatureData', async () => {
    console.log('Received request for monthly temperature data');
    try {
      const monthlyTemperatureData = await fetchMontlyTemperatureData();

      // console.log('Sending monthly temperature data:', monthlyTemperatureData);
      socket.emit('monthlyTemperatureData', monthlyTemperatureData);
    } catch (error) {
      console.error('Error fetching monthly temperature data:', error);
      socket.emit('error', {
        message: 'Failed to fetch monthly temperature data',
      });
    }
  });
  socket.on('fetchMonthlyHumidityData', async () => {
    console.log('Received request for monthly temperature data');
    try {
      const monthlyHumidityData = await fetchMonthlyHumidityData();

      // console.log('Sending monthly humidity data:', monthlyHumidityData);
      socket.emit('monthlyHumidityData', monthlyHumidityData);
    } catch (error) {
      console.error('Error fetching monthly humidity data:', error);
      socket.emit('error', {
        message: 'Failed to fetch monthly humidity data',
      });
    }
  });
  socket.on('fetchWeatherSeasonChartData', async () => {
    console.log('Received request for monthly temperature data');
    try {
      const weatherSeasonChartData = await fetchWeatherSeasonData();

      console.log('Sending weather season  data:', weatherSeasonChartData);
      socket.emit('weatherSeasonChartData', weatherSeasonChartData);
    } catch (error) {
      console.error('Error fetching monthly humidity data:', error);
      socket.emit('error', {
        message: 'Failed to fetch monthly humidity data',
      });
    }
  });

  socket.on('fetchData', async (params) => {
    console.log('Received request for data with params:', params);
    const { page, limit, filter, sort } = params;

    try {
      const query = WeatherData.find();

      if (filter) {
        query.where('field_to_filter').equals(filter);
      }

      if (sort) {
        query.sort({ createdAt: sort === 'asc' ? 1 : -1 });
      }

      const data = await query
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();

      socket.emit('data', data);
    } catch (error) {
      console.error('Error fetching data:', error);
      socket.emit('error', { message: 'Failed to fetch data' });
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
  console.log('procted route');
  res.status(200).json({ message: 'Protected route Accessed  Successfully' });
});

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  const filePath = req.file!.path;

  try {
    csvQueue.add('csv-job', { filePath });
    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// app.get('/data', verifyToken, async (req: Request, res: Response) => {
//   console.log('dhsldf');
//   const { page = 1, limit = 5, sort = 'desc', filter = '' } = req.query;
//   console.log('backend');
//   console.log(sort);

//   const pageNum = Number(page);
//   const limitNum = Number(limit);

//   const data = await WeatherData.find()
//     .skip((pageNum - 1) * limitNum)
//     .limit(limitNum)
//     .sort({ time: sort == 'asc' ? 1 : -1 });

//   console.log(data);

//   res.status(200).json({ data, message: 'Data fetched successfully' });
// });
// app.get(
//   '/cloud-cover-data',
//   verifyToken,
//   async (req: Request, res: Response) => {
//     console.log('cloud cover');
//     const { year } = req.query;

//     const data = await fetchCloudCoverMonthlyData();
//     console.log(data);

//     res.status(200).json({ data, message: 'Data fetched successfully' });
//   }
// );

app.use('/admin/queues', serverAdapter.getRouter());

connectDb();

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
