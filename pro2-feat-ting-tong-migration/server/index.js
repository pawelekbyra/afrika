
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { connectDB } = require('./config/db');
const authRoutes = require('./routes/auth');
const paymentRoutes = require('./routes/payment');
const userRoutes = require('./routes/userRoutes');
const slideRoutes = require('./routes/slides');

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/slides', slideRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
