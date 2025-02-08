const express = require('express');
const controller = require('../controllers/stripeController');
const router = express.Router();

router.post('/checkout', controller.createCheckoutSession);
router.post('/paymentStatus/:session_id', controller.paymentStatus);

module.exports = router;