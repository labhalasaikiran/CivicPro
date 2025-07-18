const express = require('express');
const { getCommitteeFeed, addComment } = require('../controllers/committeeController');
const protect = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/feed', protect, getCommitteeFeed);
router.post('/:id/comment', protect, addComment);

module.exports = router;
