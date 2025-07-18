const mongoose = require('mongoose');

const goodDeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  mediaUrl: String,
  mediaType: String, 
}, { timestamps: true });

module.exports = mongoose.model('GoodDeed', goodDeedSchema);
