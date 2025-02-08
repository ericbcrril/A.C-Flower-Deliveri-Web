// backend/models/model.js
const mongoose = require('mongoose');

const orders = new mongoose.Schema({
  userId: String,
  receiver: String,
  letter: String,
  items: Object,
  bouquet: Object,
  state: {
          state0: Boolean,
          state1: Boolean,
          state2: Boolean,
        },
  address: {
          address: String,
          cp: String,
          municipality: String,
          locality: String
  },
  date: String,
  time: String,
  finalized: Boolean,
});

module.exports = mongoose.model('orders', orders);