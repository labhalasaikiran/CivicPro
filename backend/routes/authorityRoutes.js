const router = require('express').Router();
const protect = require('../middleware/authMiddleware');
const roleCheck = require('../middleware/roleMiddleware');

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
  validateComplaint,
  getCivilianDetails  // <-- exists in controller
} = require('../controllers/authorityController');

// All authority routes require auth + authority role
router.use(protect, roleCheck('authority'));

// Dashboard
router.get('/dashboard', getDashboard);

// Announcements
router.post('/announcements', postAnnouncement);
router.get('/announcements', getAnnouncements);

// Complaints
router.get('/complaints', viewComplaints);
router.post('/complaints', fileComplaint);

// Reporting Offender
router.post('/report', reportOffender);

// Civilian Search
router.get('/search-civilians', searchCivilians);     // FIXED
router.get('/civilian-details/:id', getCivilianDetails); // FIXED

// Authority Profile
router.get('/profile', getProfile);
router.put('/profile', updateProfile);

// Validation Workflows
router.get('/pending-good-deeds', getPendingGoodDeeds);
router.get('/pending-complaints', getPendingComplaints);
router.put('/validate-good-deed/:id', validateGoodDeed);
router.put('/validate-complaint/:id', validateComplaint);

module.exports = router;
