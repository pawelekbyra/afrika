const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Slide = require('../models/Slide');
const Like = require('../models/Like');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// GET /api/slides - Zwraca listę wszystkich slajdów z informacjami o polubieniach
router.get('/', auth, async (req, res) => {
  try {
    const slides = await Slide.find().sort({ createdAt: -1 });

    const slidesWithLikes = await Promise.all(
      slides.map(async (slide) => {
        const likeCount = await Like.countDocuments({ slide: slide._id });
        const userLike = await Like.findOne({ slide: slide._id, user: req.user._id });
        return {
          ...slide.toObject(),
          likes: likeCount,
          isLiked: !!userLike,
        };
      })
    );

    res.json(slidesWithLikes);
  } catch (err) {
    console.error('Błąd podczas pobierania slajdów:', err.message);
    res.status(500).send('Błąd serwera');
  }
});

// POST /api/slides - Utwórz nowy slajd (tylko admin)
router.post('/', auth, admin, async (req, res) => {
  try {
    const { type, src, title, author } = req.body;
    const newSlide = new Slide({ type, src, title, author });
    const savedSlide = await newSlide.save();
    res.status(201).json(savedSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT /api/slides/:id - Zaktualizuj slajd (tylko admin)
router.put('/:id', auth, admin, async (req, res) => {
  try {
    const { type, src, title, author } = req.body;
    const updatedSlide = await Slide.findByIdAndUpdate(
      req.params.id,
      { type, src, title, author },
      { new: true }
    );
    if (!updatedSlide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.json(updatedSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE /api/slides/:id - Usuń slajd (tylko admin)
router.delete('/:id', auth, admin, async (req, res) => {
  try {
    const deletedSlide = await Slide.findByIdAndDelete(req.params.id);
    if (!deletedSlide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    await Like.deleteMany({ slide: req.params.id });
    res.json({ message: 'Slide removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// POST /api/slides/:id/like - Polubienie slajdu
router.post('/:id/like', auth, async (req, res) => {
  try {
    const slideId = req.params.id;
    const userId = req.user._id;

    // Sprawdź, czy slajd istnieje
    const slide = await Slide.findById(slideId);
    if (!slide) {
      return res.status(404).json({ msg: 'Slajd nie został znaleziony.' });
    }

    // Sprawdź, czy użytkownik już polubił ten slajd
    const existingLike = await Like.findOne({ slide: slideId, user: userId });
    if (existingLike) {
      return res.status(400).json({ msg: 'Już polubiłeś ten slajd.' });
    }

    // Utwórz nowe polubienie
    const newLike = new Like({
      user: userId,
      slide: slideId,
    });

    await newLike.save();
    res.status(201).json({ msg: 'Slajd został polubiony.' });
  } catch (err) {
    console.error('Błąd podczas polubienia slajdu:', err.message);
    res.status(500).send('Błąd serwera');
  }
});

// DELETE /api/slides/:id/like - Cofnięcie polubienia slajdu
router.delete('/:id/like', auth, async (req, res) => {
  try {
    const slideId = req.params.id;
    const userId = req.user._id;

    // Znajdź i usuń polubienie
    const like = await Like.findOneAndDelete({ slide: slideId, user: userId });
    if (!like) {
      return res.status(404).json({ msg: 'Nie polubiłeś tego slajdu.' });
    }

    res.json({ msg: 'Polubienie zostało cofnięte.' });
  } catch (err) {
    console.error('Błąd podczas cofania polubienia:', err.message);
    res.status(500).send('Błąd serwera');
  }
});

module.exports = router;
