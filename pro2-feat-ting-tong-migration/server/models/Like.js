const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slide: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Slide',
    required: true,
  },
}, {
  timestamps: true,
});

// Add a unique compound index to prevent a user from liking the same slide more than once.
LikeSchema.index({ user: 1, slide: 1 }, { unique: true });

const Like = mongoose.model('Like', LikeSchema);

module.exports = Like;
