const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// --------------------
// API ROUTES
// --------------------
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/civilian', require('./routes/civilianRoutes'));
app.use('/api/authority', require('./routes/authorityRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes'));

// --------------------
// SERVE FRONTEND BUILD
// --------------------
const buildPath = path.join(__dirname, 'build');
app.use(express.static(buildPath));

// IMPORTANT: catch-all WITHOUT path string
app.use((req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
