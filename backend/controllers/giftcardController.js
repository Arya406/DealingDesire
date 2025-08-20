const GiftCard = require('../models/GiftCard');

exports.createGiftCard = async (req, res) => {
  try {
    const { title, description, brand, value, sellingPrice, image } = req.body;
    const newCard = await GiftCard.create({
      title,
      description,
      brand,
      value,
      sellingPrice,
      image,
      seller: req.user._id
    });
    res.status(201).json(newCard);
  } catch (err) {
    res.status(500).json({ message: 'Error creating gift card' });
  }
};

// Get all gift cards (only available ones for marketplace)
exports.getAllGiftCards = async (req, res) => {
  try {
    const cards = await GiftCard.find({ status: 'available' })
      .populate('seller', 'name email username')
      .select('-code'); // Don't expose the gift card code in public listings
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gift cards' });
  }
};

// Get current user's gift cards (for dashboard)
exports.getMyGiftCards = async (req, res) => {
  try {
    const cards = await GiftCard.find({ seller: req.user._id });
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching your gift cards' });
  }
};

exports.getSellerGiftCards = async (req, res) => {
  try {
    const cards = await GiftCard.find({ 
      seller: req.params.sellerId,
      status: 'available' 
    }).select('-code'); // Don't expose the gift card code in public listings
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching seller gift cards' });
  }
};

exports.updateGiftCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await GiftCard.findById(id);
    
    if (!card) return res.status(404).json({ message: 'Gift card not found' });
    if (card.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this gift card' });
    }

    const updatedCard = await GiftCard.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updatedCard);
  } catch (err) {
    res.status(500).json({ message: 'Error updating gift card' });
  }
};

exports.deleteGiftCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await GiftCard.findById(id);
    
    if (!card) return res.status(404).json({ message: 'Gift card not found' });
    if (card.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this gift card' });
    }

    await GiftCard.findByIdAndDelete(id);
    res.json({ message: 'Gift card deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting gift card' });
  }
};

exports.purchaseGiftCard = async (req, res) => {
  const { id } = req.params;
  try {
    const card = await GiftCard.findById(id);
    if (!card || card.status === 'sold') return res.status(404).json({ message: 'Not available' });

    card.status = 'sold';
    await card.save();

    res.json({ message: 'Purchased successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Purchase failed' });
  }
};