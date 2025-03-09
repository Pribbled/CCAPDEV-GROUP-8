const Reservation = require('../models/reservation');
const Lab = require('../models/lab');

function add(server) {
    server.get('/reservationPageLabtech', async function (req, resp) {
        try {
            const labs = await Lab.find().lean();
            resp.render('reservationPageLabtech',{
                layout: 'index',
                title: 'Reserve a Slot',
                labs: labs,
                stylesheet: 'reservePageLabtech'
            });
        } catch (error) {
            console.error("Error rendering reservation page:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
