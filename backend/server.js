// server.js or index.js (main server file)

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authorityRoutes = require('./routes/authorityRoutes');
const civilianRoutes = require('./routes/civilianRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/authority', authorityRoutes);
app.use('/api/civilian', civilianRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});