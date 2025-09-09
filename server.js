import express from 'express';
import userRoutes from './routes/user.routes.js';
import todoRoutes from './routes/todo.routes.js';
import connectDatabase from './db/index.js';
import dotenv from 'dotenv';
const app = express();
const port = 8000;

// Load environment variables from .env file
dotenv.config({
  path: '.env'
});

// connect to the database
connectDatabase();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Use the user routes
app.use('/api/users', userRoutes);

// Use the todo routes
app.use('/api/todos', todoRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${process.env.PORT || port}`);
});