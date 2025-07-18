const GoodDeed = require('../models/GoodDeed');
const Comment = require('../models/Comment');

// fetching good deeds
exports.getCommitteeFeed = async (req, res) => {
  try {
    const deeds = await GoodDeed.find()
      .populate('userId', 'name role') 
      .sort({ createdAt: -1 });

const deedsWithComments = await Promise.all(
deeds.map(async (deed) => {
        const comments = await Comment.find({ goodDeedId: deed._id })
          .populate('userId', 'name role')
          .sort({ createdAt: 1 });
        return { ...deed.toObject(), comments };
      })
    );

res.json(deedsWithComments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch committee feed' });
  }
};

// comment on a good deed
// exports.addComment = async (req, res) => {
//   try {
//     const { goodDeedId, content } = req.body;

//     const comment = await Comment.create({
//       goodDeedId,
//       userId: req.user._id,
//       content
//     });

//     const populatedComment = await comment.populate('userId', 'name role');

//     res.status(201).json(populatedComment);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to add comment' });
//   }
// };


exports.addComment = async (req, res) => {
  try {
    const { text } = req.body; // comment text
    const { id } = req.params; // GoodDeed ID from URL

    // Check if GoodDeed exists
    const goodDeed = await GoodDeed.findById(id);
    if (!goodDeed) {
      return res.status(404).json({ message: 'Good Deed not found' });
    }

    // Create comment
    const comment = await Comment.create({
      goodDeedId: id,
      userId: req.user._id,
      content: text
    });

    // Populate user details in the response
    const populatedComment = await comment.populate('userId', 'name role');

    res.status(201).json(populatedComment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
};


