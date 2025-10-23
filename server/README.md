# QuickBook Keeper Backend

This is the backend server for the QuickBook Keeper accounting system, built with Express and MongoDB.

## Features

- User authentication and authorization
- Transaction management (income and expenses)
- Category management
- Budget tracking
- Secure API endpoints

## Technologies Used

- Node.js
- Express.js
- MongoDB with Mongoose ODM
- JSON Web Tokens (JWT) for authentication
- Bcrypt for password hashing
- CORS for cross-origin resource sharing
- Helmet for security headers

## Setup Instructions

1. Make sure you have Node.js and MongoDB installed on your system.

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/quickbook-keeper
JWT_SECRET=your_jwt_secret_key_here
PORT=5000
NODE_ENV=development
```

4. Run the development server:
```bash
npm run dev
```

5. The server will start on `http://localhost:5000`

## API Documentation

Complete API documentation can be found in [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## Folder Structure

```
server/
├── config/           # Database configuration
├── controllers/      # Request handlers
├── middleware/       # Authentication and error handling middleware
├── models/           # Mongoose models
├── routes/           # API route definitions
├── utils/            # Utility functions
├── .env             # Environment variables
├── .gitignore
├── API_DOCUMENTATION.md
├── package.json
└── server.js        # Main server file
```

## API Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/transactions` - Get all transactions
- `POST /api/transactions` - Create a new transaction
- `GET /api/transactions/:id` - Get a transaction by ID
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `GET /api/categories/:id` - Get a category by ID
- `PUT /api/categories/:id` - Update a category
- `DELETE /api/categories/:id` - Delete a category
- `GET /api/budgets` - Get all budgets
- `POST /api/budgets` - Create a new budget
- `GET /api/budgets/:id` - Get a budget by ID
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget