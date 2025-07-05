import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  amount: number;
  description: string;
  date: Date;
  category: string;
  type: 'expense' | 'income';
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [200, 'Description cannot exceed 200 characters']
  },
  date: {
    type: Date,
    required: [true, 'Date is required'],
    default: Date.now
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['expense', 'income'],
      message: 'Type must be either expense or income'
    }
  }
}, {
  timestamps: true
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema); 