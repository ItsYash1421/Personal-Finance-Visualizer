const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');
const transactionRoutes = require('./routes/transactions');
const budgetRoutes = require('./routes/budgets');
const categoryRoutes = require('./routes/categories');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/categories', categoryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Personal Finance API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 