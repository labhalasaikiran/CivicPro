const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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