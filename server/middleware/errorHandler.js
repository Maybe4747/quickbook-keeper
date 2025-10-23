const { errorResponse } = require('../utils/responseFormatter');

const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for development
  console.log(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = { message, statusCode: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = { message, statusCode: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(value => value.message);
    error = { message, statusCode: 400 };
  }

  res.status(error.statusCode || 500).json(
    errorResponse(error.message || 'Server Error', error.statusCode || 500)
  );
};

module.exports = errorHandler;