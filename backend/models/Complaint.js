const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  filedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  content: String,
  mediaUrl: String,
  mediaType: String,
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
