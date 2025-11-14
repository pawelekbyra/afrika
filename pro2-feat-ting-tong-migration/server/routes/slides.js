// Plik: server/routes/slides.js
// Ten plik definiuje endpoint API do pobierania slajdów z bazy danych.

const express = require('express');
const router = express.Router();
const Slide = require('../models/Slide'); // Importujemy model slajdu!

// GET /api/slides - Zwraca listę wszystkich slajdów
router.get('/', async (req, res) => {
  try {
    // Pobierz wszystkie slajdy z bazy danych
    // Sortujemy po dacie utworzenia, aby najnowsze były pierwsze
    const slides = await Slide.find().sort({ createdAt: -1 });

    res.json(slides);
  } catch (err) {
    console.error('Błąd podczas pobierania slajdów:', err.message);
    res.status(500).send('Błąd serwera');
  }
});

// W przyszłości można tu dodać endpointy do tworzenia, edycji i usuwania slajdów.
// np. POST /api/slides, PUT /api/slides/:id, DELETE /api/slides/:id

module.exports = router;
