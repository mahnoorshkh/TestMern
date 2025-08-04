require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./dbConnect');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.use(cors());
connectDB();

app.use(express.json());

app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

app.listen(5000, () => console.log('✅ Server running on port 5000'));
