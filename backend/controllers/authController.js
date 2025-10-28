const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

exports.signup = async (req,res) => {
 const {name,email,password,role} = req.body;

 const existing = await User.findOne({email});
    if(existing) return res.status(400).json({message :"user exists"});


const hash = await bcrypt.hash(password,10);
const user = await User.create({name,email,password : hash,role});

const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
};

exports.login = async(req,res) =>{
    const {name,email,password,role} = req.body;
const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch || user.role !== role)
    return res.status(400).json({ msg: 'Invalid credentials or role' });

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
  res.json({ token, user });
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const resetLink = `http://localhost:3000/reset-password/${token}`;
  await transporter.sendMail({
    to: user.email,
    subject: 'Password Reset Request',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 15 minutes.</p>`
  });

  res.json({ message: 'Password reset link sent to your email.' });
};

exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  // Password constraints: at least 8 chars, one letter, one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters long and contain at least one letter and one number.'
    });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hashed = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(decoded.id, { password: hashed });
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(400).json({ message: 'Invalid or expired token.' });
  }
};