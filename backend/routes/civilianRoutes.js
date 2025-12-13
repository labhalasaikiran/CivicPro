const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');

const {
  getDashboard,
  postGoodDeed,
  getAnnouncements,
  getComplaints,
  submitComplaint,
  getProfile,
  updateProfile
} = require('../controllers/civilianController');

// Protect all civilian routes
router.use(protect, roleCheck('civilian'));

router.get('/dashboard', getDashboard);
router.post('/good-deeds', postGoodDeed);
router.get('/announcements', getAnnouncements);
router.get('/complaints', getComplaints);
router.post('/complaints', submitComplaint);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
