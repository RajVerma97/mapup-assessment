import express from 'express';
import path from 'path';
import userRoutes from './api/routes/userRoutes';

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDb from './db';
import { authorize } from './api/middleware/auth';

dotenv.config();

const app = express();

const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

const MONGODBURI = process.env.MONGODB_URI;

app.get('/', (req: Request, res: Response) => {
  console.log('from the index');
  console.log(req.user);
  res.render('index', { user: req.user });
});

connectDb();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
