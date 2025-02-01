import mysql from 'mysql2';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

export const connectToDatabase = () => {
  return new Promise((resolve, reject) => {
    db.connect((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

export const createUsersTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    await connectToDatabase();
    await new Promise((resolve, reject) => {
      db.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          console.log('Users table created or already exists');
          resolve();
        }
      });
    });
  } catch (error) {
    console.error('Error creating users table:', error);
  }
};

createUsersTable().catch((error) => {
  console.error('Failed to create users table:', error);
});
