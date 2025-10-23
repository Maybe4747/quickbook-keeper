const jwt = require('jsonwebtoken');
require('dotenv').config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'default_secret_key', {
    expiresIn: '30d',
  });
};

module.exports = generateToken;