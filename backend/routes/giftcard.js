const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createGiftCard,
  getAllGiftCards,
  purchaseGiftCard
} = require('../controllers/giftcardController');

// Define routes with proper path definitions
router.route('/')
  .post(auth, createGiftCard)
  .get(getAllGiftCards);

router.route('/purchase/:id')
  .patch(auth, purchaseGiftCard);

module.exports = router;
