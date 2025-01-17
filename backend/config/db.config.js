import dotenv from 'dotenv';

dotenv.config();

export default {
  HOST: process.env.DB_HOST || 'localhost',
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || '888888',
  DB: process.env.DB || 'node-app1',
};
