const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { successResponse, errorResponse } = require('../utils/responseFormatter');

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  // Check if user already exists
  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400);
    throw new Error('Username already exists');
  }

  const user = await User.create({
    username,
    password
  });

  if (user) {
    res.status(201).json(
      successResponse({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      }, '用户注册成功')
    );
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Authenticate user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Validation
  if (!username || !password) {
    res.status(400);
    throw new Error('Please provide username and password');
  }

  // Check for user username
  const user = await User.findOne({ username }).select('+password');

  if (user && (await user.matchPassword(password))) {
    res.status(200).json(
      successResponse({
        _id: user._id,
        username: user.username,
        token: generateToken(user._id)
      }, '用户登录成功')
    );
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    res.status(200).json(
      successResponse({
        _id: user._id,
        username: user.username
      }, '获取用户资料成功')
    );
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.username = req.body.username || user.username;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.status(200).json(
      successResponse({
        _id: updatedUser._id,
        username: updatedUser.username,
        token: generateToken(updatedUser._id)
      }, '更新用户资料成功')
    );
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile
};