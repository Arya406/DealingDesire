const express = require('express');
const router = express.Router();
const giftcardController = require('../controllers/giftcardController');
const auth = require('../middleware/authMiddleware');

// Public routes
router.get('/', giftcardController.getAllGiftCards);
router.get('/seller/:sellerId', giftcardController.getSellerGiftCards);

// Protected routes
router.use(auth);
router.get('/my-cards', giftcardController.getMyGiftCards);
router.post('/', giftcardController.createGiftCard);
router.put('/:id', giftcardController.updateGiftCard);
router.delete('/:id', giftcardController.deleteGiftCard);
router.post('/:id/purchase', giftcardController.purchaseGiftCard);

module.exports = router;