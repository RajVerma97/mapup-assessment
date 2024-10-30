import express from 'express';
import multer from 'multer';
const router = express.Router();
const upload = multer();
import { loginUser } from '../controllers/userController.js';
router.post('/login', upload.none(), loginUser);
export default router;
