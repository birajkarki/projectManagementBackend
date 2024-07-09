const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const commentRoutes = require('./routes/commentRoutes');
const errorMiddleware = require('./middleware/errorMiddleware');
const bodyParser = require('body-parser');

dotenv.config({ path: './config.env' });

// Connect to the database
connectDB();

const app = express();

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/comments', commentRoutes);

// Error handling middleware
app.use(errorMiddleware);

const port = process.env.PORT || 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on Port ${port} in ${process.env.NODE_ENV} mode`);
});

module.exports = app;
