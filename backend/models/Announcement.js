const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema(
  {
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, 
    },
    title: {
      type: String,required: true,trim: true,
    },
    description: {
      type: String,
        required: true,trim: true,
    },
    mediaUrl: {
      type: String,
      default: null,
    },
    mediaType: {
      type: String, enum: ['image', 'video', 'audio', null],default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Announcement', announcementSchema);
