import express from 'express';
import userRoutes from './routes/user.routes.js';
import todoRoutes from './routes/todo.routes.js';
import connectDatabase from './db/index.js';
import dotenv from 'dotenv';
import cors from 'cors';

const app = express();
const port = 8000;

// Load environment variables from .env file
dotenv.config({
  path: './.env'
});

// connect to the database
connectDatabase().then(() => {
  // Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT || port}`);
});
}).catch((error) => {
  console.error('Failed to connect to the database:', error);
});

// Middleware to parse JSON bodies
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use the user routes
app.use('/api/users', userRoutes);

// Use the todo routes
app.use('/api/todos', todoRoutes);