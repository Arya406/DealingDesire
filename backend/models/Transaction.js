const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  giftCard: { type: mongoose.Schema.Types.ObjectId, ref: 'GiftCard' },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  amount: Number,
  status: { type: String, enum: ['pending', 'completed', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
