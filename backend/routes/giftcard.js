const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createGiftCard,
  getAllGiftCards,
  purchaseGiftCard
} = require('../controllers/giftcardController');

router.post('/', auth, createGiftCard);
router.get('/', getAllGiftCards);
router.patch('/purchase/:id', auth, purchaseGiftCard);

module.exports = router;
