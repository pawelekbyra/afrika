// Plik: server/models/User.js
// Ten plik definiuje schemat i model użytkownika dla bazy danych MongoDB przy użyciu Mongoose.

const mongoose = require('mongoose');

// Definicja schematu użytkownika
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Adres email jest wymagany.'],
      unique: true,
      trim: true, // Usuwa białe znaki z początku i końca
      lowercase: true, // Zapisuje email małymi literami
      match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Proszę podać prawidłowy adres email.'],
    },
    password: {
      type: String,
      required: [true, 'Hasło jest wymagane.'],
    },
    // Dodatkowe pola, które mogą być potrzebne w przyszłości
    // np. is_profile_complete, avatar_url, etc.
  },
  {
    // Opcje schematu
    timestamps: true, // Automatycznie dodaje pola createdAt i updatedAt
  }
);

// Tworzenie i eksportowanie modelu na podstawie schematu
// Mongoose automatycznie stworzy kolekcję o nazwie 'users' (w liczbie mnogiej)
const User = mongoose.model('User', UserSchema);

module.exports = User;
