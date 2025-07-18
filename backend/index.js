const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const cors = require('cors');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


//Routes
app.use('/api/auth',require('./routes/authRoutes'));
app.use('/api/civilian',require('./routes/civilianRoutes'));
app.use('/api/authority',require('./routes/authorityRoutes'));
app.use('/api/upload',require('./routes/uploadRoutes'));
app.use('/api/committee', require('./routes/committeeRoutes'));



const PORT = process.env.PORT || 5000;
app.listen(PORT ,()=>console.log(`server running on http://localhost:${PORT}`));