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
import http from 'http';
import { setupSocketIO } from './socket-io';
import WeatherData from './api/models/weather';

dotenv.config();

const app = express();
// const server = http.createServer(app);
// setupSocketIO(server);

const port = 5001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true,
  })
);

app.use('/user', userRoutes);

const MONGODBURI = process.env.MONGODB_URI;

const upload = multer({ dest: 'uploads/' });

app.get('/', (req: Request, res: Response) => {
  console.log('from the index');
  console.log(req.user);
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

app.get('/data', verifyToken, async (req: Request, res: Response) => {
  const { page = 1, limit = 5, sort = 'desc', filter = '' } = req.query;

  const pageNum = Number(page);
  const limitNum = Number(limit);

  const data = await WeatherData.find()
    .skip((pageNum - 1) * limitNum)
    .limit(parseInt(limit as string))
    .sort({ date: sort });

  res.status(200).json({ data, message: 'Data fetched successfully' });
});

app.use('/admin/queues', serverAdapter.getRouter());

connectDb();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
