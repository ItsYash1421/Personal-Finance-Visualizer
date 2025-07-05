const express = require('express');

const router = express.Router();

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = [
      { id: '1', name: 'Food & Dining', color: '#EF4444', icon: 'UtensilsCrossed' },
      { id: '2', name: 'Transportation', color: '#3B82F6', icon: 'Car' },
      { id: '3', name: 'Shopping', color: '#8B5CF6', icon: 'ShoppingBag' },
      { id: '4', name: 'Entertainment', color: '#F59E0B', icon: 'Film' },
      { id: '5', name: 'Bills & Utilities', color: '#10B981', icon: 'Receipt' },
      { id: '6', name: 'Healthcare', color: '#EC4899', icon: 'Heart' },
      { id: '7', name: 'Education', color: '#6366F1', icon: 'GraduationCap' },
      { id: '8', name: 'Travel', color: '#14B8A6', icon: 'Plane' },
      { id: '9', name: 'Investment', color: '#84CC16', icon: 'TrendingUp' },
      { id: '10', name: 'Other', color: '#6B7280', icon: 'MoreHorizontal' },
    ];
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

module.exports = router; 