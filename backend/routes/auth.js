const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

function signToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
}

router.post('/register', async (req, res) => {
  try {
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!name) return res.status(400).json({ message: 'Name is required.' });
    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email is already registered.' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash });

    const token = signToken(user._id.toString());

    return res.status(201).json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const email = typeof req.body?.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body?.password === 'string' ? req.body.password : '';

    if (!email) return res.status(400).json({ message: 'Email is required.' });
    if (!password) return res.status(400).json({ message: 'Password is required.' });

    const user = await User.findOne({ email }).select('+passwordHash');
    if (!user) return res.status(401).json({ message: 'Invalid email or password.' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Invalid email or password.' });

    const token = signToken(user._id.toString());

    return res.json({
      token,
      user: { id: user._id.toString(), name: user.name, email: user.email },
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
