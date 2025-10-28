const GoodDeed = require('../models/GoodDeed');
const BadDeed = require('../models/BadDeed');
const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');
const User = require('../models/User');

//  good/bad history
exports.getDashboard = async (req, res) => {
  const goodDeeds = await GoodDeed.find({ userId: req.user._id, status: 'approved' });
  const badDeeds = await BadDeed.find({ civilianId: req.user._id });
  res.json({
    goodDeedsCount: goodDeeds.length,
    badDeedsCount: badDeeds.length,
    goodDeeds,
    badDeeds
  });
};

// post a good deed
exports.postGoodDeed = async (req, res) => {
  const { content, mediaUrl, mediaType } = req.body;
  const deed = await GoodDeed.create({
    userId: req.user._id,
    content,
    mediaUrl,
    mediaType,
    status: 'pending'
  });
  res.status(201).json(deed);
};

// Announcements
exports.getAnnouncements = async (req, res) => {
  const announcements = await Announcement.find().sort({ createdAt: -1 });
  res.json(announcements);
};

// Complaints
exports.getComplaints = async (req, res) => {
  const complaints = await Complaint.find({ filedBy: req.user._id, status: 'approved' }).sort({ createdAt: -1 });
  res.json(complaints);
};

exports.submitComplaint = async (req, res) => {
  const { content, mediaUrl, mediaType } = req.body;
  const complaint = await Complaint.create({
    filedBy: req.user._id,
    content,
    mediaUrl,
    mediaType,
    status: 'pending'
  });
  res.status(201).json(complaint);
};

// Profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json(user);
};

exports.updateProfile = async (req, res) => {
  const updates = req.body;
  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
  res.json(user);
};
