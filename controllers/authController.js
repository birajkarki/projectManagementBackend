const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const upload = require('../config/multer'); // Import multer middleware
const multer = require('multer'); // Import multer

exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({
      name,
      email,
      password,
      role,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        msg: 'User successfully created'
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        msg: 'Login successful'
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateProfile = async (req, res) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        // MulterError occurred
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ msg: 'File size limit exceeded. Maximum size allowed is 1MB.' });
        } else {
          return res.status(400).json({ msg: 'Something went wrong with file upload' });
        }
      } else if (err) {
        // Other unexpected errors during file upload
        console.error('File upload error:', err);
        return res.status(500).json({ msg: 'Something went wrong with file upload' });
      }
  
      const { name, email, profileImage } = req.body;
  
      try {
        let user = await User.findById(req.user.id);
  
        if (!user) {
          return res.status(404).json({ msg: 'User not found' });
        }
  
        // Update user data
        user.name = name || user.name;
        user.email = email || user.email;
        user.profileImage = profileImage || user.profileImage;
  
        // Check if a file was uploaded
        if (req.file) {
          user.profileImage = req.file.path; // Save file path to user profileImage field
        }
  
        await user.save();
  
        res.json({ msg: 'Profile updated successfully', user });
      } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Server error');
      }
    });
  };