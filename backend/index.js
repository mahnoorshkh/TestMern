require('dotenv').config();
const express = require('express');
const connectDB = require('./dbConnect');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
connectDB();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.listen(3000, () => console.log('✅ Server running on port 3000'));
