// backend/models/model.js
const mongoose = require('mongoose');

const bouquets = new mongoose.Schema({
  image: String,
  name: String,
  price: Number,
  description: String,
  stripeProductId: String , // ID del producto en Stripe
  stripePriceId: String ,   // ID del precio en Stripe
});

module.exports = mongoose.model('bouquets', bouquets);