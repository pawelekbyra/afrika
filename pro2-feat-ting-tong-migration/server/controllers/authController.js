
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const registerUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ msg: 'Proszę podać email i hasło' });
  }

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ msg: 'Użytkownik o tym emailu już istnieje' });
    }

    const user = await User.create({
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ msg: 'Nieprawidłowe dane użytkownika' });
    }
  } catch (err) {
    console.error('Błąd serwera przy rejestracji:', err.message);
    res.status(500).send('Błąd serwera');
  }
};

const authUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: user.avatar,
        isProfileComplete: user.isProfileComplete,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ msg: 'Nieprawidłowy email lub hasło' });
    }
  } catch (err) {
    console.error('Błąd serwera przy logowaniu:', err.message);
    res.status(500).send('Błąd serwera');
  }
};

const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ msg: 'Nie znaleziono użytkownika' });
    }
  } catch (err) {
    console.error('Błąd serwera przy pobieraniu profilu:', err.message);
    res.status(500).send('Błąd serwera');
  }
};

module.exports = { registerUser, authUser, getUserProfile };
