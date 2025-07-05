const mongoose = require('mongoose');
const Transaction = require('./src/models/Transaction');

const connectDB = async () => {
  const mongoURI = 'mongodb+srv://yashamanmeena1:y5yXdZm0uF4O6DCh@pfv.uzlra7q.mongodb.net/personal-finance?retryWrites=true&w=majority&appName=PFV';
  await mongoose.connect(mongoURI);
};

const run = async () => {
  await connectDB();
  const txs = await Transaction.find({});
  console.log('Transactions:', txs.length);
  process.exit(0);
};

run();