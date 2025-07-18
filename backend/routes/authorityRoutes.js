const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');
const User = require('../models/User');
const {
  getDashboard,
  postAnnouncement,
  getAnnouncements,
  viewComplaints,
  fileComplaint,
  searchCivilians,
  reportOffender
} = require('../controllers/authorityController');


router.use(protect, roleCheck('authority'));
router.get('/dashboard', getDashboard);
router.post('/announcements', postAnnouncement);
router.get('/announcements', getAnnouncements);
router.get('/complaints', viewComplaints);
router.post('/complaints', fileComplaint);
router.post('/report', reportOffender);
router.get('/search-civilian', searchCivilians);


module.exports = router;
