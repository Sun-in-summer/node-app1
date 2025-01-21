import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'http-status-codes';
import { validateEmail, validatePassword } from '../utils/auth-utils.js';
import { StatusCodes } from 'http-status-codes';
import { connectToDatabase } from '../config/init-database.js';
import { db } from '../config/init-database.js';

const SALT_ROUNDS = 10;
const SECRET_KEY = 'secret_key';

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  if (!validateEmail(email) || !validatePassword(password)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ message: 'Invalid email or password' });
  }

  try {
    await connectToDatabase();

    const [results] = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (results && results.length > 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO users (email, password) VALUES (?, ?)',
        [email, hashedPassword],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        }
      );
    });

    res
      .status(StatusCodes.CREATED)
      .json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    await connectToDatabase();
    const [results] = await new Promise((resolve, reject) => {
      db.query(
        'SELECT * FROM users WHERE email = ?',
        [email],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });

    if (!results && results.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'User not found' });
    }
    console.log('results', results);
    const user = results;
    console.log(user);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'Invalid password' });
    }

    const token = jwt.sign({ id: user.id }, SECRET_KEY, {
      expiresIn: '1h',
    });

    res
      .status(StatusCodes.OK)
      .json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Error during login:', error);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: 'Internal server error' });
  }
};
