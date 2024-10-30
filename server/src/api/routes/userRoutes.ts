import express from 'express';
import multer from 'multer';
const router = express.Router();
const upload = multer();

import { Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';

const { registerUser, loginUser } = require('../controllers/userController');

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}

router.post('/login', upload.none(), loginUser);

export default router;
