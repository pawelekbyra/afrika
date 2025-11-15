// Plik: server/models/Slide.js
// Ten plik definiuje schemat i model slajdu dla bazy danych MongoDB przy użyciu Mongoose.

const mongoose = require('mongoose');

// Definicja schematu slajdu
const SlideSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: [true, 'Typ slajdu jest wymagany.'],
      enum: ['video', 'image', 'iframe'], // Ogranicza możliwe wartości
    },
    src: {
      type: String,
      required: [true, 'Źródło (URL) jest wymagane.'],
    },
    title: {
      type: String,
      required: [true, 'Tytuł jest wymagany.'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Autor jest wymagany.'],
      trim: true,
    },
    // Pole `likes` zostało usunięte. Liczba polubień będzie dynamicznie zliczana z kolekcji `likes`.
    // uploadedBy: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'User',
    // },
  },
  {
    // Opcje schematu
    timestamps: true, // Automatycznie dodaje pola createdAt i updatedAt
  }
);

// Tworzenie i eksportowanie modelu na podstawie schematu
const Slide = mongoose.model('Slide', SlideSchema);

module.exports = Slide;
