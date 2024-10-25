import express from 'express';
import multer from 'multer';
import { authorize } from '../middleware/auth';
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

router.get('/register', (req, res) => {
  res.render('register.ejs');
});
router.post('/register', upload.none(), registerUser);

router.get('/login', (req, res) => {
  res.render('login.ejs');
});

router.post('/login', upload.none(), loginUser);

router.get('/protected', authorize, (req, res) => {
  console.log('from the protected route');
  console.log(req.user);
});
export default router;
