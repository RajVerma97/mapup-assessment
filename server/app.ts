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

dotenv.config();

const app = express();

const port = 5001;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cors());

app.use('/api', userRoutes);

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

  csvQueue.add('csv-job', { filePath });

  res.status(200).send('File uploaded and processing started.');
});

app.use('/admin/queues', serverAdapter.getRouter());

connectDb();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
