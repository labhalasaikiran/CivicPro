const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');
const BadDeed = require('../models/BadDeed');
const GoodDeed = require('../models/GoodDeed');
const User = require('../models/User'); // Removed duplicate GoodDeed import

// Dashboard
exports.getDashboard = async (req, res) => {
  try {
    const announcements = await Announcement.find({ postedBy: req.user._id });
    res.json({ announcements });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch dashboard' });
  }
};

// Announcements
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

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email'); // FIXED duplicate populate

    res.json(announcements);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};

// Complaints
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

// Civilian Search
exports.searchCivilians = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const civilians = await User.find({
      role: 'civilian',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { houseNo: { $regex: query, $options: 'i' } },
        { phone: { $regex: query, $options: 'i' } },
        { address: { $regex: query, $options: 'i' } }
      ]
    });

    if (!civilians.length) {
      return res.status(404).json({ message: 'No civilians found' });
    }

    res.status(200).json(civilians);
  } catch (err) {
    console.error('searchCivilians error:', err);
    res.status(500).json({ message: 'Error searching civilians', error: err.message });
  }
};

// Civilian Details
exports.getCivilianDetails = async (req, res) => {
  try {
    if (req.user.role !== 'authority') {
      return res.status(403).json({ message: 'Forbidden: Only authority can view civilian details' });
    }

    const { id } = req.params;

    const civilian = await User.findById(id).lean();
    if (!civilian || civilian.role !== 'civilian') {
      return res.status(404).json({ message: 'Civilian not found' });
    }

    const [goodDeeds, badDeeds] = await Promise.all([
      GoodDeed.find({ userId: id }).sort({ createdAt: -1 }).lean(),
      BadDeed.find({ civilianId: id }).sort({ createdAt: -1 }).lean(),
    ]);

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
      badDeeds,
    });
  } catch (err) {
    console.error('getCivilianDetails error:', err);
    res.status(500).json({ message: 'Error fetching civilian details', error: err.message });
  }
};

// Report Offender
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

// Profile
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

// Validation Workflows
exports.getPendingGoodDeeds = async (req, res) => {
  try {
    const deeds = await GoodDeed.find({ status: 'pending' })
      .populate('userId', 'name email');

    res.json(deeds);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending good deeds' });
  }
};

exports.getPendingComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find({ status: 'pending' })
      .populate('filedBy', 'name email');

    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch pending complaints' });
  }
};

exports.validateGoodDeed = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const deed = await GoodDeed.findByIdAndUpdate(id, { status }, { new: true });
  res.json(deed);
};

exports.validateComplaint = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const complaint = await Complaint.findByIdAndUpdate(id, { status }, { new: true });
  res.json(complaint);
};
