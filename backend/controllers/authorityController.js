const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');
const BadDeed = require('../models/BadDeed');
const User = require('../models/User');

// Dashboard placeholder (can be extended later)
exports.getDashboard = async (req, res) => {
  const announcements = await Announcement.find({ postedBy: req.user._id });
  res.json({ announcements });
};

// Post announcement
exports.postAnnouncement = async (req, res) => {
  const { title, description, mediaUrl, mediaType } = req.body;
  console.log('REQ.BODY:', req.body);
  const announcement = await Announcement.create({
    postedBy: req.user._id,
    title,
    description,
    mediaUrl,
    mediaType
  });
  res.status(201).json(announcement);
};




// Get  announcements 
exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email'); 
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ error: 'Failed to fetch announcements' });
  }
};



// View and file complaints
exports.viewComplaints = async (req, res) => {
  const complaints = await Complaint.find().sort({ createdAt: -1 });
  res.json(complaints);
};

exports.fileComplaint = async (req, res) => {
  const { content, mediaUrl, mediaType } = req.body;
  const complaint = await Complaint.create({
    filedBy: req.user._id,
    content,
    mediaUrl,
    mediaType
  });
  res.status(201).json(complaint);
};



// In authorityController.js
exports.searchCivilians = async (req, res) => {
  try {
    const { query } = req.query; // name, email, or house number
    if (!query) return res.status(400).json({ message: 'Search query is required' });

    const civilian = await User.findOne({
      role: 'civilian',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { houseNo: { $regex: query, $options: 'i' } }
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
        houseNo: civilian.houseNo
      },
      goodDeeds,
      badDeeds
    });
  } catch (error) {
    res.status(500).json({ message: 'Error searching civilian', error: error.message });
  }
};

 // Report  civilian
exports.reportOffender = async (req, res) => {
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
};
