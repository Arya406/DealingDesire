const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createGiftCard,
  getAllGiftCards,
  getSellerGiftCards,
  updateGiftCard,
  deleteGiftCard,
  purchaseGiftCard
} = require('../controllers/giftcardController');

router.route('/')
  .post(auth, createGiftCard)
  .get(getAllGiftCards);

router.route('/seller/:sellerId')
  .get(auth, getSellerGiftCards);

router.route('/:id')
  .put(auth, updateGiftCard)
  .delete(auth, deleteGiftCard);

router.route('/purchase/:id')
  .patch(auth, purchaseGiftCard);

module.exports = router;