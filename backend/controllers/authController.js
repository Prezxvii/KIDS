const User = require('../models/User');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const JWT_SECRET  = process.env.JWT_SECRET || 'kids_platform_secret_change_in_prod';
const JWT_EXPIRES = '30d';

// ── Helper: generate token ────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// ── Helper: safe user object (no password) ────────────────────────────────────
const safeUser = (user) => ({
  _id:       user._id,
  firstName: user.firstName,
  email:     user.email,
  path:      user.path,
  createdAt: user.createdAt,
});

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/signup
// ─────────────────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
  try {
    const { firstName, email, password, path } = req.body;

    if (!firstName || !email || !password || !path)
      return res.status(400).json({ message: 'Please fill in all fields' });

    if (password.length < 6)
      return res.status(400).json({ message: 'Password must be at least 6 characters' });

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists)
      return res.status(400).json({ message: 'An account with that email already exists' });

    // Hash password
    const salt         = await bcrypt.genSalt(10);
    const hashedPass   = await bcrypt.hash(password, salt);

    const user = await User.create({
      firstName: firstName.trim(),
      email:     email.toLowerCase().trim(),
      password:  hashedPass,
      path,
    });

    res.status(201).json({
      ...safeUser(user),
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Please enter email and password' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user)
      return res.status(401).json({ message: 'No account found with that email' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Incorrect password' });

    res.json({
      ...safeUser(user),
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// GET /api/auth/me  (protected)
// Returns the current user's profile from their JWT token
// ─────────────────────────────────────────────────────────────────────────────
const getMe = async (req, res) => {
  try {
    // req.user is set by the protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(safeUser(user));
  } catch (err) {
    console.error('getMe error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// PUT /api/auth/profile  (protected)
// Update name and/or path
// ─────────────────────────────────────────────────────────────────────────────
const updateProfile = async (req, res) => {
  try {
    const { firstName, path } = req.body;
    const updates = {};
    if (firstName) updates.firstName = firstName.trim();
    if (path)      updates.path      = path;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user)
      return res.status(404).json({ message: 'User not found' });

    res.json(safeUser(user));
  } catch (err) {
    console.error('updateProfile error:', err);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

module.exports = { registerUser, loginUser, getMe, updateProfile };