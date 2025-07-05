const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use the same MongoDB Atlas connection as the seed script
      const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://yashamanmeena1:y5yXdZm0uF4O6DCh@pfv.uzlra7q.mongodb.net/personal-finance?retryWrites=true&w=majority&appName=PFV';
      await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Starting server without database connection for testing...');
    // Don't exit the process, let the server start without DB
  }
};

module.exports = connectDB; 