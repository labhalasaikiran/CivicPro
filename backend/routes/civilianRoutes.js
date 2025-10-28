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
router.post('/good-deeds', postGoodDeed); // protected
router.get('/announcements', getAnnouncements);
router.get('/complaints', getComplaints); // protected
router.post('/complaints', submitComplaint); // protected
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

module.exports = router;
router.put('/profile', updateProfile);

module.exports = router;
