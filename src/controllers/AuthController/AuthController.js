const User = require("../../models/UserModel/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const secretKey = process.env.SECRET_KEY;

const signToken = (userId) =>
  jwt.sign({ id: userId }, secretKey, { expiresIn: "7d" });

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // 1) Check all fields
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email and password are required" });
    }

    // 2) Prevent duplicate emails
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email already in use" });
    }

    // 3) Create & save user
    const user = await User.create({ name, email, password });

    // 4) Send back token + basic user info
    const token = signToken(user._id);
    res.status(201).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // 1) Check both fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 2) Find user & include hashed password
    const user = await User.findOne({ email }).select('+password'); 
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3) Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 4) Issue token
    const token = signToken(user._id);

    // 5) Return token + user info (omit password!)
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    next(err);
  }
};