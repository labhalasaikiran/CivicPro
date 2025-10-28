const mongoose = require('mongoose');

const connectWithRetry = async (uri, attempts = 0) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // useCreateIndex: true, // not needed in newer mongoose
      // useFindAndModify: false
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(`MongoDB connection error (attempt ${attempts + 1}):`, err.message);
    // If DNS / ENOTFOUND, show helpful guidance once
    if (err.message.includes('ENOTFOUND') || err.message.includes('getaddrinfo')) {
      console.error('DNS resolution failed. Check network, DNS, and your MONGO_URI host name.');
      console.error('Run: nslookup <your-cluster-host>  or ping <your-cluster-host>');
      console.error('Also ensure your IP is whitelisted in MongoDB Atlas Network Access.');
    }
    if (attempts < 5) {
      const delay = 2000 * (attempts + 1);
      console.log(`Retrying MongoDB connection in ${delay}ms...`);
      setTimeout(() => connectWithRetry(uri, attempts + 1), delay);
    } else {
      console.error('MongoDB connection failed after multiple attempts.');
      process.exit(1);
    }
  }
};

module.exports = {
  connectDB: () => {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      console.error('MONGO_URI not set in environment');
      process.exit(1);
    }
    connectWithRetry(uri);
  }
};