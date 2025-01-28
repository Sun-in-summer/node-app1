import express from 'express';
import { registerUser, login } from '../controllers/auth-controller.js';

const authRouter = express.Router();

authRouter.post('/register', registerUser);
authRouter.post('/login', login);

export default authRouter;
