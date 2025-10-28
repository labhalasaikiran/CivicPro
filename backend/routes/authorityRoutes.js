const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
// const User = require('../models/User');
const {
  getDashboard,
  postAnnouncement,
  getAnnouncements,
  viewComplaints,
  fileComplaint,
  searchCivilians,
  reportOffender,
  getProfile,
  updateProfile,
  getPendingGoodDeeds,
  validateGoodDeed,
  getPendingComplaints,
  validateComplaint
} = require('../controllers/authorityController');


router.use(protect, roleCheck('authority'));
router.get('/dashboard', getDashboard);
router.post('/announcements', postAnnouncement);
router.get('/announcements', getAnnouncements);
router.get('/complaints', viewComplaints);
router.post('/complaints', fileComplaint);
router.post('/report', reportOffender);
router.get('/search-civilians', searchCivilians);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.get('/pending-good-deeds', getPendingGoodDeeds);
router.get('/pending-complaints', getPendingComplaints);
router.put('/validate-good-deed/:id', validateGoodDeed);
router.put('/validate-complaint/:id', validateComplaint);


module.exports = router;
