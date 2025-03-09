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

            console.log("🔍 Received Query:", { lab, date, startTime });

            const labDetails = await Lab.findOne({ name: lab }).lean();
            if (!labDetails) {
                return res.status(404).json({ error: "Lab not found" });
            }
            const totalSeats = labDetails.totalSeats;
            console.log("🏢 Total Seats in Lab:", totalSeats);

            const reservations = await Reservation.find({ lab, date, startTime }).lean();
            const reservedSeats = reservations.flatMap(reservation => reservation.seats.map(seat => seat.seatNumber));

            console.log("🚫 Reserved Seats:", reservedSeats);

            const availableSeats = [];
            for (let i = 1; i <= totalSeats; i++) {
                if (!reservedSeats.includes(i)) {
                    availableSeats.push({ seatNumber: i, status: "Available" });
                }
            }

            console.log("✅ Available Seats:", availableSeats);

            res.json(availableSeats);
        } catch (error) {
            console.error("❌ Error fetching available seats:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
    
    
}

module.exports.add = add;

