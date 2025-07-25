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
    res.json(newCard);
  } catch (err) {
    res.status(500).json({ message: 'Error creating gift card' });
  }
};

exports.getAllGiftCards = async (req, res) => {
  try {
    const cards = await GiftCard.find({ status: 'available' }).populate('seller', 'name email');
    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching gift cards' });
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
