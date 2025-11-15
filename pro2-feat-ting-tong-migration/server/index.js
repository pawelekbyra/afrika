
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const slideRoutes = require('./routes/slides');
const commentRoutes = require('./routes/comments');
const pushRoutes = require('./routes/push');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Serwuj pliki statyczne z katalogu 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/slides', slideRoutes);
app.use('/api/slides/:slideId/comments', commentRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/push', pushRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
