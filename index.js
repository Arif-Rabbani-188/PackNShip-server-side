// index.js
// Application entry point. Sets up middleware, DB, routes (paths unchanged), and starts server.
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

// Initialize services
const admin = require('./config/firebase');
const { connectDB } = require('./config/db');

// Routers (preserve original endpoint paths)
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Global middleware
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Health check / root
app.get('/', (_req, res) => res.send('Hello World!'));

// Auth helper route (unchanged path)
app.post('/jwt', (req, res) => {
  const user = req.body;
  const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
  res.cookie('accessToken', token, { httpOnly: true, secure: false });
  res.send({ token });
});

// Mount original routes (no prefix so paths remain exactly the same)
app.use(productRoutes); // /products, /products/:id, /myProducts, etc.
app.use(userRoutes);    // /users, /users/:id

// Start sequence: connect DB then listen
connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGINT', () => { console.log('SIGINT received'); process.exit(0); });
process.on('SIGTERM', () => { console.log('SIGTERM received'); process.exit(0); });
