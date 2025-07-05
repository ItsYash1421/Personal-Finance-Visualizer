const express = require('express');
const Budget = require('../models/Budget');

const router = express.Router();

// Get all budgets
router.get('/', async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ month: -1, category: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error });
  }
});

// Get budgets by month
router.get('/month/:month', async (req, res) => {
  try {
    const { month } = req.params;
    const budgets = await Budget.find({ month }).sort({ category: 1 });
    res.json(budgets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching budgets', error });
  }
});

// Create new budget
router.post('/', async (req, res) => {
  try {
    const budget = new Budget(req.body);
    await budget.save();
    res.status(201).json(budget);
  } catch (error) {
    res.status(400).json({ message: 'Error creating budget', error });
  }
});

// Update budget
router.put('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json(budget);
  } catch (error) {
    res.status(400).json({ message: 'Error updating budget', error });
  }
});

// Delete budget
router.delete('/:id', async (req, res) => {
  try {
    const budget = await Budget.findByIdAndDelete(req.params.id);
    if (!budget) {
      return res.status(404).json({ message: 'Budget not found' });
    }
    res.json({ message: 'Budget deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting budget', error });
  }
});

module.exports = router; 