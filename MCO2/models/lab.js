const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    location: { type: String, required: true },
    totalSeats: { type: Number, required: true }
});

const Lab = mongoose.models.labs || mongoose.model('labs', labSchema);

module.exports = Lab;
