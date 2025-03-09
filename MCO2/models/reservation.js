const mongoose = require('mongoose');

const date = new Date();
const today = date.toISOString().split('T')[0];

const reservationSchema = new mongoose.Schema({
    lab: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    seats: [{
        seatNumber: Number,
        status: { type: String, enum: ['Available', 'Reserved'], default: 'Available' }
    }],
    name: { type: String, required: true },
    isAnonymous: { type: Boolean, default: false },
    requestDate: { type: String, default: today}
}, { timestamps: true });

const Reservation = mongoose.models.reservations || mongoose.model('reservations', reservationSchema);

module.exports = Reservation;
