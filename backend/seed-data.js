const mongoose = require('mongoose');
const Transaction = require('./src/models/Transaction');
const Budget = require('./src/models/Budget');

// Connect to MongoDB
const connectDB = async () => {
  try {
    // Use the same connection string as your backend
    const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://yashamanmeena1:y5yXdZm0uF4O6DCh@pfv.uzlra7q.mongodb.net/personal-finance?retryWrites=true&w=majority&appName=PFV';
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Categories
const categories = [
  'Food & Dining',
  'Transportation',
  'Entertainment',
  'Utilities',
  'Shopping',
  'Healthcare',
  'Housing',
  'Education',
  'Travel'
];

// Helper to get all months between two dates (inclusive)
function getMonthList(start, end) {
  const result = [];
  let date = new Date(start.getFullYear(), start.getMonth(), 1);
  const endDate = new Date(end.getFullYear(), end.getMonth(), 1);
  while (date <= endDate) {
    result.push({
      year: date.getFullYear(),
      month: (date.getMonth() + 1).toString().padStart(2, '0'),
    });
    date.setMonth(date.getMonth() + 1);
  }
  return result;
}

const months = getMonthList(new Date('2024-01-01'), new Date('2025-07-01'));

// Generate transactions and budgets for each month/category
const allTransactions = [];
const allBudgets = [];

months.forEach(({ year, month }) => {
  categories.forEach(category => {
    // Budget for the month/category
    allBudgets.push({
      category,
      amount: 100 + Math.floor(Math.random() * 500), // random budget 100-600
      month: `${year}-${month}`
    });
    // 1-2 transactions per category per month
    const numTx = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < numTx; i++) {
      allTransactions.push({
        amount: 10 + Math.floor(Math.random() * 500), // random amount 10-510
        description: `${category} expense`,
        date: new Date(`${year}-${month}-${10 + i}`),
        category,
        type: 'expense'
      });
    }
  });
  // Add a salary income for each month
  allTransactions.push({
    amount: 1200,
    description: 'Salary',
    date: new Date(`${year}-${month}-15`),
    category: 'Other',
    type: 'income'
  });
});

// Seed the database
const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing data
    await Transaction.deleteMany({});
    await Budget.deleteMany({});
    console.log('Cleared existing data');
    
    // Insert sample transactions
    await Transaction.insertMany(allTransactions);
    console.log(`Inserted ${allTransactions.length} transactions`);
    
    // Insert sample budgets
    await Budget.insertMany(allBudgets);
    console.log(`Inserted ${allBudgets.length} budgets`);
    
    console.log('Database seeded successfully!');
    console.log('\nSample data includes:');
    console.log('- 12 transactions (mix of income and expenses)');
    console.log('- 18 budgets (9 categories × 2 months)');
    console.log('- Data spans January and February 2024');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

  
// Run the seed function
seedDatabase(); 