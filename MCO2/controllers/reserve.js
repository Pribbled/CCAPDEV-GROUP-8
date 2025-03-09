const Reservation = require('../models/reservation');

function add(server) {
    server.get('/reservationPage', async function(req, res) {
        try {
            res.render('reservationpage', {
                layout: 'index',
                title: 'Reserve a Slot',
                stylesheet: 'reservePage',
            });
        } catch (error) {
            console.error("Error rendering reservation page:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    server.get('/api/reservations', async (req, res) => {
        try {
            const { lab, date, startTime } = req.query;

            if (!lab || !date || !startTime) {
                return res.status(400).json({ error: "Missing required query parameters." });
            }

            const reservations = await Reservation.find({
                lab,
                date: new Date(date),
                startTime
            }).lean();

            res.json(reservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });
}

module.exports.add = add;
