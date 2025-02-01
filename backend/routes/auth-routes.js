import express from 'express';
import { registerUser, login } from '../controllers/auth-controller.js';
import multer from 'multer';

const upload= multer();

const authRouter = express.Router();

authRouter.post('/register', upload.none(), registerUser);
authRouter.post('/login', upload.none(), login);

export default authRouter;
