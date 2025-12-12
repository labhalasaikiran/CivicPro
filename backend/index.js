const express = require('express');
const dotenv = require('dotenv');
const { connectDB } = require('./config/db');
const cors = require('cors');
const path = require('path');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/civilian', require('./routes/civilianRoutes'));
app.use('/api/authority', require('./routes/authorityRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes'));

// ---------------------------------------------
// SERVE FRONTEND BUILD (VERY IMPORTANT)
// ---------------------------------------------
app.use(express.static(path.join(__dirname, 'build')));

// For ANY non-API routes → return frontend index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// ---------------------------------------------
// PORT CONFIG FOR RENDER
// ---------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);
