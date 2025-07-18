const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
   name : String,
   email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['civilian', 'authority'], required: true },
  age: Number,
  phone: String,
  address: String,
  profilePic: String,
  badges: [String],
},{timestamps : true});

module.exports = mongoose.model('User',userSchema);