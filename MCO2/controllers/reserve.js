const Reservation = require('../models/reservation');

function add(server) {
    server.get('/reservationPage', async function(req, res) {
        try {
            const reservations = await Reservation.find({}).lean();
            res.render('reservationpage', {
                layout: 'index',
                title: 'Reserve a Slot',
                stylesheet: 'reservePage',
                reservations: reservations
            });
        } catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    server.get('/api/reservations', async (req, res) => {
        try {
            const reservations = await Reservation.find({}).lean();
            res.json(reservations);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).send("Internal Server Error");
        }
    });    
}

module.exports.add = add;
