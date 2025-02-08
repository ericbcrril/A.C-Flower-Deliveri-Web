// backend/models/model.js
const mongoose = require('mongoose');

const items = new mongoose.Schema({
  image: String,
  name: String,
  price: Number,
  type: String,
  stripeProductId: String , // ID del producto en Stripe
  stripePriceId: String ,   // ID del precio en Stripe
});

module.exports = mongoose.model('items', items);