// backend/models/model.js
const mongoose = require('mongoose');

const modelSchema = new mongoose.Schema({
  name: String,
  age: Number,
  birthdate: Date,
  isAdmin: Boolean,
  hobbies: [String],
  address: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  profilePicture: Buffer,
  manager: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  metadata: mongoose.Schema.Types.Mixed,
  salary: { type: mongoose.Schema.Types.Decimal128 },
  settings: { type: Map, of: String }
});

module.exports = mongoose.model('model', modelSchema);