const mongoose = require('mongoose');

const badDeedSchema = new mongoose.Schema({
  reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  civilianId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  mediaUrl: String,
  mediaType: String,
}, { timestamps: true });

module.exports = mongoose.model('BadDeed', badDeedSchema);
