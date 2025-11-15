// Plik: server/config/db.js
// Ten plik eksportuje funkcję do nawiązywania połączenia z bazą danych MongoDB przy użyciu Mongoose.

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Pobranie connection stringa ze zmiennych środowiskowych
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      throw new Error('Brak zdefiniowanego MONGODB_URI w pliku .env');
    }

    // Połączenie z bazą danych
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Połączono z bazą danych MongoDB Atlas');
  } catch (err) {
    console.error('❌ Błąd połączenia z bazą danych:', err.message);
    // Zakończ proces z błędem
    process.exit(1);
  }
};

module.exports = { connectDB };
