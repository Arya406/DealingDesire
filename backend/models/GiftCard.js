const mongoose = require('mongoose');

const giftCardSchema = new mongoose.Schema({
  title: String,
  description: String,
  brand: String,
  value: Number,
  sellingPrice: Number,
  image: String,
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['available', 'sold'], default: 'available' }
}, { timestamps: true });

module.exports = mongoose.model('GiftCard', giftCardSchema);
