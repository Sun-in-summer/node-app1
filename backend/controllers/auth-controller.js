import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'http-status-codes';
import { validateEmail, validatePassword } from '../utils/auth-utils.js';
import { StatusCodes } from 'http-status-codes';
import { connectToDatabase } from '../config/init-database.js';
import { db } from '../config/init-database.js';
import { checkCaptcha } from '../middleware/captcha.middleware.js';

const SALT_ROUNDS = 10;
const SECRET_KEY = 'secret_key';

export const registerUser = async (req, res) => {
  const { email, password, captcha } = req.body;
  const emailIsValid = validateEmail(email);
  const passwordValidationResult = validatePassword(password);
  if (!checkCaptcha(captcha, req.session)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Invalid CAPTCHA' });
  }
  if (!emailIsValid || !passwordValidationResult) {
    const errorMessage = !emailIsValid
      ? 'Invalid email'
      : passwordValidationResult.message;

    return res.status(StatusCodes.BAD_REQUEST).json({ message: errorMessage });
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

    if (results) {
      console.log(results);
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
            if (err.code === 'ER_DUP_ENTRY') {
              return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: 'User already exists' });
            }
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
  const { email, password, captcha } = req.body;
  if (!checkCaptcha(captcha, req.session)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .send({ message: 'Invalid CAPTCHA' });
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

    if (!results && results.length === 0) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: 'User not found' });
    }
    const user = results;
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
