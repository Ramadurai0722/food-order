const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../model/user');

const register = async (req, res) => {
  try {
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      age: req.body.age,
      gender: req.body.gender,
    });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const userData = await User.findOne({ email: req.body.email });
    if (!userData) {
      return res.status(400).json({ error: "User email not found" }); 
    }
    const validPsw = await bcrypt.compare(req.body.password, userData.password);
    if (!validPsw) {
      return res.status(400).json({ error: "Invalid password" });
    }
    
    const userToken = jwt.sign({ email: userData.email }, 'ragasiyam');
    res.header('Authorization', userToken).json({ token: userToken });
    
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email }).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  register,
  login,
  getProfile,
};
