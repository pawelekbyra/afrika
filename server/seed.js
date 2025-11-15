// Plik: server/seed.js
// Ten skrypt służy do jednorazowego zasilenia bazy danych przykładowymi danymi.

require('dotenv').config({ path: __dirname + '/.env' });
const mongoose = require('mongoose');
const Slide = require('./models/Slide');

const sampleSlides = [
  {
    type: 'video',
    src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4',
    title: 'Wielki Królik',
    author: 'Blender Foundation',
    likes: 123,
  },
  {
    type: 'video',
    src: 'https://sample-videos.com/video123/mp4/480/big_buck_bunny_480p_1mb.mp4',
    title: 'Królik w niższej jakości',
    author: 'Blender Foundation',
    likes: 45,
  },
  {
    type: 'video',
    src: 'https://assets.mixkit.co/videos/preview/mixkit-small-flowering-plant-in-a-field-41885-large.mp4',
    title: 'Piękny kwiatek na wietrze',
    author: 'NatureVideos',
    likes: 789,
  },
];

const seedDB = async () => {
  try {
    // 1. Połączenie z bazą danych
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Połączono z MongoDB Atlas w celu zasilenia danymi...');

    // 2. Usunięcie istniejących danych (opcjonalnie, ale dobre dla czystości)
    await Slide.deleteMany({});
    console.log('🧹 Usunięto istniejące slajdy...');

    // 3. Wstawienie nowych danych
    await Slide.insertMany(sampleSlides);
    console.log('🌱 Pomyślnie dodano przykładowe slajdy!');

  } catch (err) {
    console.error('❌ Wystąpił błąd podczas zasilania bazy danych:', err.message);
  } finally {
    // 4. Zamknięcie połączenia
    mongoose.connection.close();
    console.log('🔌 Rozłączono z bazą danych.');
  }
};

seedDB();
