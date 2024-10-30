import express from 'express';
import multer from 'multer';
const router = express.Router();
const upload = multer();
const { registerUser, loginUser } = require('../controllers/userController');
router.post('/login', upload.none(), loginUser);
export default router;
