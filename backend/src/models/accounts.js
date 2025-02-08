const mongoose = require('mongoose');

const accounts = new mongoose.Schema({
    name: {type: String},
    lastName: {type: String},
    user: {type: String},
    password: {type: String},
    email: {type: String},
    cellPhone: {type: String},
    type: {type: Boolean}
});

module.exports = mongoose.model('accounts', accounts);