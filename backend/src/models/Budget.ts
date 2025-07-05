import mongoose, { Document, Schema } from 'mongoose';

export interface IBudget extends Document {
  amount: number;
  category: string;
  month: string; // Format: YYYY-MM
  createdAt: Date;
  updatedAt: Date;
}

const budgetSchema = new Schema<IBudget>({
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount must be positive']
  },
  category: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Compound index to ensure unique budget per category per month
budgetSchema.index({ category: 1, month: 1 }, { unique: true });

export default mongoose.model<IBudget>('Budget', budgetSchema); 