const Announcement = require('../models/Announcement');
const Complaint = require('../models/Complaint');
const BadDeed = require('../models/BadDeed');
const GoodDeed = require('../models/GoodDeed');
const User = require('../models/User');

// Dashboard  /
exports.getDashboard = async (req, res) => {
  try {
    if (req.user.role !== 'authority') {
      return res.status(403).json({ message: 'Forbidden: Only authority can access this' });
    }

    const announcements = await Announcement.find({ postedBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email');

    res.json({ announcements });
  } catch (err) {
    console.error('getDashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard', error: err.message });
  }
};

//Announcements  
exports.postAnnouncement = async (req, res) => {
  try {
    if (req.user.role !== 'authority') {
      return res.status(403).json({ message: 'Forbidden: Only authority can post announcements' });
    }

    const { title, description, mediaUrl, mediaType } = req.body;
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    const announcement = await Announcement.create({
      postedBy: req.user._id,
      title,
      description,
      mediaUrl,
      mediaType,
    });

    res.status(201).json(announcement);
  } catch (err) {
    console.error('postAnnouncement error:', err);
    res.status(500).json({ message: 'Failed to create announcement', error: err.message });
  }
};

exports.getAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find()
      .sort({ createdAt: -1 })
      .populate('postedBy', 'name email');
    res.json(announcements);
  } catch (err) {
    console.error('getAnnouncements error:', err);
    res.status(500).json({ message: 'Failed to fetch announcements', error: err.message });
  }
};

// Complaints 
exports.viewComplaints = async (req, res) => {
  try {
    if (req.user.role !== 'authority') {
      return res.status(403).json({ message: 'Forbidden: Only authority can view complaints' });
    }

    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error('viewComplaints error:', err);
    res.status(500).json({ message: 'Failed to fetch complaints', error: err.message });
  }
};

exports.fileComplaint = async (req, res) => {
  try {
    const { content, mediaUrl, mediaType } = req.body;
    if (!content) {
      return res.status(400).json({ message: 'Content is required for complaint' });
    }

    const complaint = await Complaint.create({
      filedBy: req.user._id,
      content,
      mediaUrl,
      mediaType,
    });
    res.status(201).json(complaint);
  } catch (err) {
    console.error('fileComplaint error:', err);
    res.status(500).json({ message: 'Failed to file complaint', error: err.message });
  }
};

//  Search 1 for purpose of reporting
exports.searchCiviliansList = async (req, res) => {
  try {
    if (req.user.role !== 'authority') {
      return res.status(403).json({ message: 'Forbidden: Only authority can search civilians' });
    }

    const { query } = req.query;
    if (!query || !query.trim()) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const civilians = await User.find({
      role: 'civilian',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } },
        { houseNo: { $regex: query, $options: 'i' } },
      ],
    })
      .select('_id name email houseNo')
      .limit(10)
      .lean();

    if (!civilians.length) {
      return res.status(404).json({ message: 'No civilians found' });
    }

    res.status(200).json(civilians);
  } catch (err) {
    console.error('searchCiviliansList error:', err);
    res.status(500).json({ message: 'Error searching civilians', error: err.message });
  }
};

// Search 2: Detailss
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
    if (req.user.role !== 'authority') {
      return res.status(403).json({ message: 'Forbidden: Only authority can report offenders' });
    }

    const { civilianId, content, mediaUrl, mediaType } = req.body;
    if (!civilianId || !content) {
      return res.status(400).json({ message: 'civilianId and content are required' });
    }

    const civilian = await User.findById(civilianId);
    if (!civilian || civilian.role !== 'civilian') {
      return res.status(404).json({ message: 'Civilian not found' });
    }

    const report = await BadDeed.create({
      reportedBy: req.user._id,
      civilianId,
      content,
      mediaUrl,
      mediaType,
    });

    res.status(201).json(report);
  } catch (err) {
    console.error('reportOffender error:', err);
    res.status(500).json({ message: 'Failed to report civilian', error: err.message });
  }
};
