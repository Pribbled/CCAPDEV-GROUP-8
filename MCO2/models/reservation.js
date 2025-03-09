const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    lab: { type: mongoose.Schema.Types.ObjectId, ref: 'Lab', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    seats: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Seat' }],
    name: { type: String, required: true },
    requestDate: { type: Date, default: Date.now },
    isAnonymous: { type: Boolean, default: false }
});

module.exports = mongoose.model('Reservation', reservationSchema);
