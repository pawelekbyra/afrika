const express = require('express');
const router = express.Router({ mergeParams: true });
const Comment = require('../models/Comment');
const Slide = require('../models/Slide');
const auth = require('../middleware/auth');

// GET /api/slides/:slideId/comments - Pobierz komentarze dla slajdu
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find({ slide: req.params.slideId }).populate('author', 'displayName avatar').sort({ createdAt: 'asc' });
    res.json(comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// POST /api/slides/:slideId/comments - Dodaj komentarz
router.post('/', auth, async (req, res) => {
  try {
    const slide = await Slide.findById(req.params.slideId);
    if (!slide) {
      return res.status(404).json({ msg: 'Slide not found' });
    }

    const newComment = new Comment({
      content: req.body.content,
      author: req.user.id,
      slide: req.params.slideId,
      parent: req.body.parent || null,
    });

    const comment = await newComment.save();
    await comment.populate('author', 'displayName avatar');

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// PUT /api/comments/:commentId - Edytuj komentarz
router.put('/:commentId', auth, async (req, res) => {
  try {
    let comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Sprawdź, czy użytkownik jest autorem komentarza
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    comment.content = req.body.content;
    await comment.save();
    await comment.populate('author', 'displayName avatar');

    res.json(comment);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// DELETE /api/comments/:commentId - Usuń komentarz
router.delete('/:commentId', auth, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ msg: 'Comment not found' });
    }

    // Sprawdź, czy użytkownik jest autorem komentarza
    if (comment.author.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User not authorized' });
    }

    // Rekursywne usuwanie dzieci
    const deleteChildren = async (parentId) => {
      const children = await Comment.find({ parent: parentId });
      for (const child of children) {
        await deleteChildren(child._id);
        await Comment.findByIdAndDelete(child._id);
      }
    };

    await deleteChildren(req.params.commentId);
    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({ msg: 'Comment removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


module.exports = router;
