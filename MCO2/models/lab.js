const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    totalSeats: { type: Number, required: true }
});

module.exports = mongoose.model('Lab', labSchema);
