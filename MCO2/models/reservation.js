const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    lab: {type: String, required: true},
    date: {type: Date, required: true},
    startTime: {type: Date, required: true},
    endTime: {type: Date, required: true},
    seats: {type: Number, required: true},
    name: {type: String, required: true},
    requestDate: {type: Date, required: true}
});

module.exports = mongoose.model('reservation', reservationSchema);