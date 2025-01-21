import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import router from './routes/auth-routes.js';
import { createUsersTable } from './config/init-database.js';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());
// app.use(
//   session({
//     secret: 'your-secret-key', //убрать в env?
//     resave: false,
//     saveUninitialized: true,
//   })
// );

async function init() {
  try {
    await createUsersTable();
    console.log('Database initialized.');
    app.use('/auth', router);
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error('Error initializing database:', err);
  }
}

init();
