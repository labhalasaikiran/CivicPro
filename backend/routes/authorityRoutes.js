// const router = require('express').Router();
// const protect = require('../middleware/authMiddleware');
// const roleCheck = require('../middleware/roleMiddleware');
// const User = require('../models/User');
// const {
//   getDashboard,
//   postAnnouncement,
//   getAnnouncements,
//   viewComplaints,
//   fileComplaint,
//   searchCivilians,
//   reportOffender
// } = require('../controllers/authorityController');

// //  Search civilians by name or email (protected, but not role-restricted)
// router.get('/search-civilians', protect, async (req, res) => {
//   const query = req.query.query;

//   try {
//     const civilians = await User.find({
//       role: 'civilian',
//       $or: [
//         { email: { $regex: query, $options: 'i' } },
//         { name: { $regex: query, $options: 'i' } }
//       ]
//     }).select('name email');
//     res.json(civilians);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to search civilians' });
//   }
// });




// router.use(protect, roleCheck('authority'));
// router.get('/dashboard', getDashboard);
// router.post('/announcements', postAnnouncement);
// router.get('/announcements', getAnnouncements);
// router.get('/complaints', viewComplaints);
// router.post('/complaints', fileComplaint);
// router.post('/report', reportOffender);
// router.get('/search-civilian', searchCivilians);


// module.exports = router;



// routes/authorityRoutes.js
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

// All authority routes require auth + authority role
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


// NEW search endpoints
router.get('/search-civilians', searchCiviliansList);     // ?query=...
router.get('/civilian-details/:id', getCivilianDetails);  // details view

module.exports = router;
