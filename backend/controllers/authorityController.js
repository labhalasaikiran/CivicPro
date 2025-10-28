const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');
const BadDeed = require('../models/BadDeed');
const User = require('../models/User');
const GoodDeed = require('../models/GoodDeed');

exports.getDashboard = async (req, res) => {
  try {
    const announcements = await Announcement.find({ postedBy: req.user._id });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// Post announcement
exports.postAnnouncement = async (req, res) => {
  try {
    const { title, description, mediaUrl, mediaType, eventDateTime } = req.body;
    const announcement = await Announcement.create({
      postedBy: req.user._id,
      title,
      description,
      mediaUrl,
      mediaType,
      eventDateTime
    });
    res.status(201).json(announcement);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post announcement' });
  }
};

// Get announcements
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email');
    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// View and file complaints
exports.viewComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch complaints' });
  }
};

exports.fileComplaint = async (req, res) => {
  try {
    const { content, mediaUrl, mediaType } = req.body;
    const complaint = await Complaint.create({
      filedBy: req.user._id,
      content,
      mediaUrl,
      mediaType
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ error: 'Failed to file complaint' });
  }
};

exports.searchCivilians = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const civilian = await User.findOne({
      role: 'civilian',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { houseNo: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ]
    });

    if (!civilian) return res.status(404).json({ message: 'Civilian not found' });

    const goodDeeds = await GoodDeed.find({ userId: civilian._id });
    const badDeeds = await BadDeed.find({ userId: civilian._id });

    res.status(200).json({
      civilian: {
        _id: civilian._id,
        name: civilian.name,
        email: civilian.email,
        houseNo: civilian.houseNo,
        phone: civilian.phone,
        address: civilian.address
      },
      goodDeeds,
      badDeeds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching civilian', error: error.message });
  }
};

exports.reportOffender = async (req, res) => {
  try {
    const { civilianId, content, mediaUrl, mediaType } = req.body;
    const civilian = await User.findById(civilianId);
    if (!civilian || civilian.role !== 'civilian') {
      return res.status(404).json({ message: 'Civilian not found' });
    }
    const report = await BadDeed.create({
      reportedBy: req.user._id,
      civilianId,
      content,
      mediaUrl,
      mediaType
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: 'Failed to report offender' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updates = req.body;
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

exports.getPendingGoodDeeds = async (req, res) => {
  try {
    const deeds = await GoodDeed.find({ status: 'pending' }).populate('userId', 'name email');
    res.json(deeds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending good deeds' });
  }
};

exports.getPendingComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'pending' }).populate('filedBy', 'name email');
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending complaints' });
  }
};

exports.validateGoodDeed = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  const deed = await GoodDeed.findByIdAndUpdate(id, { status }, { new: true });
  res.json(deed);
};

exports.validateComplaint = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // 'approved' or 'rejected'
  const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
  res.json(complaint);
};
