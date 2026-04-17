const express = require('express');
const { verifyToken } = require('../middleware/auth');
const User = require('../models/User');

const router = express.Router();

function formatUserResponse(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    bio: user.bio || '',
    avatar: user.avatar,
    address: user.address || '',
    city: user.city || '',
    country: user.country || '',
    profession: user.profession || '',
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString().split('T')[0] : '',
    gender: user.gender || '',
    website: user.website || '',
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

// GET /api/user/profile - Get authenticated user's profile
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    return res.json(formatUserResponse(user));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
    return res.status(500).json({ message: 'Server error.' });
  }
});

// PUT /api/user/profile - Update authenticated user's profile
router.put('/profile', verifyToken, async (req, res) => {
  try {
    console.log('Update request received for userId:', req.userId);
    console.log('Request body:', req.body);
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Extract and validate fields
    const name = typeof req.body?.name === 'string' ? req.body.name.trim() : user.name;
    const phone = typeof req.body?.phone === 'string' ? req.body.phone.trim() : user.phone;
    const bio = typeof req.body?.bio === 'string' ? req.body.bio.trim() : user.bio;
    const address = typeof req.body?.address === 'string' ? req.body.address.trim() : user.address;
    const city = typeof req.body?.city === 'string' ? req.body.city.trim() : user.city;
    const country = typeof req.body?.country === 'string' ? req.body.country.trim() : user.country;
    const profession = typeof req.body?.profession === 'string' ? req.body.profession.trim() : user.profession;
    const gender = typeof req.body?.gender === 'string' ? req.body.gender.trim() : user.gender;
    const website = typeof req.body?.website === 'string' ? req.body.website.trim() : user.website;
    const dateOfBirth = req.body?.dateOfBirth ? new Date(req.body.dateOfBirth) : user.dateOfBirth;

    if (!name) {
      return res.status(400).json({ message: 'Name is required.' });
    }

    // Update all fields
    user.name = name;
    user.phone = phone;
    user.bio = bio;
    user.address = address;
    user.city = city;
    user.country = country;
    user.profession = profession;
    user.gender = gender;
    user.website = website;
    if (dateOfBirth && !isNaN(dateOfBirth.getTime())) {
      user.dateOfBirth = dateOfBirth;
    }

    console.log('User object before save:', user.toObject());
    await user.save();
    console.log('User saved successfully');

    return res.json(formatUserResponse(user));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error updating profile:', err);
    return res.status(500).json({ message: 'Server error.', error: err.message });
  }
});

module.exports = router;
