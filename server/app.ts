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

app.get('/', (req: Request, res: Response) => {
  console.log('from the index');
  console.log(req.user);
  res.render('index', { user: req.user });
});

app.get('/protected', verifyToken, (req: Request, res: Response) => {
  console.log('procted route');
  res.status(200).json({ message: 'Protected route Accessed  Successfully' });
});

connectDb();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
