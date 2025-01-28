import express from 'express';
import session from 'express-session';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import authRouter from './routes/auth-routes.js';
import captchaRouter from './routes/captcha-routes.js';
import { createUsersTable } from './config/init-database.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default-secret-key',
    resave: false,
    saveUninitialized: true,
  })
);
app.use('/auth', authRouter);
app.use('/captcha', captchaRouter);

app.use(express.static('frontend/public'));

async function init() {
  try {
    await createUsersTable();
    console.log('Database initialized.');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

init();
