const Reservation = require('../models/reservation');
const Lab = require('../models/lab');

function add(server) {
    server.get('/reservationPage', async function (req, res) {
        try {
            const labs = await Lab.find().lean();
            res.render('reservationpage', {
                layout: 'index',
                title: 'Reserve a Slot',
                labs : labs,
                stylesheet: 'reservePage'
            });
        } catch (error) {
            console.error("Error rendering reservation page:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    server.get('/api/seats', async (req, res) => {
        try {
            const { lab, date, startTime } = req.query;

            if (!lab || !date || !startTime) {
                return res.status(400).json({ error: "Missing required query parameters." });
            }

            const labDetails = await Lab.findOne({ name: lab }).lean();
            if (!labDetails) {
                return res.status(404).json({ error: "Lab not found" });
            }
            const totalSeats = labDetails.totalSeats;

            const reservations = await Reservation.find({ lab, date, startTime }).lean();
            const reservedSeats = reservations.flatMap(reservation => reservation.seats.map(seat => seat.seatNumber));

            const availableSeats = [];
            for (let i = 1; i <= totalSeats; i++) {
                if (!reservedSeats.includes(i)) {
                    availableSeats.push({ seatNumber: i, status: "Available" });
                }
            }

            res.json(availableSeats);
        } catch (error) {
            console.error("Error fetching available seats:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    server.post('/reservationPage', async function (req, res) {
        try {
            console.log("Received Reservation Data:", req.body);
    
            const { lab, date, startTime, endTime, seats, name, isAnonymous, email } = req.body;
    
            if (!lab || !date || !startTime || !endTime || !seats || !email) {
                return res.status(400).json({ error: "Missing required fields." });
            }
    
            const newReservation = new Reservation({
                lab,
                date,
                startTime,
                endTime,
                seats,
                name,
                isAnonymous,
                email
            });
    
            await newReservation.save();
            res.status(201).json({ message: "Reservation successful!", reservation: newReservation });
        } catch (err) {
            console.error("Error saving reservation:", err);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

module.exports.add = add;

