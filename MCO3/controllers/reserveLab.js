const Reservation = require('../models/reservation');
const Lab = require('../models/lab');
const User = require('../models/user');

function add(server) {
    server.get('/reservationPageLabtech', async function (req, resp) {
        try {

            if(!req.session.user) {
                return resp.redirect('/login');
            }
            const labs = await Lab.find().lean();
            const users = await User.find().lean();
            resp.render('reservationPageLabtech',{
                layout: 'index',
                title: 'Reserve a Slot',
                labs: labs,
                users: users,
                stylesheet: 'reservePageLabtech'
            });
        } catch (error) {
            console.error("Error rendering reservation page:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    server.post('/reservationPageLabtech', async function (req, res) {
        try {
            const { lab, date, startTime, endTime, seats, reservee, isAnonymous } = req.body;
            console.log(req.body);

            if (!lab || !date || !startTime || !seats || !reservee) {
                return res.status(400).json({ error: "Missing required fields." });
            }

            const user = await User.findOne({ firstName: reservee.split(" ")[0], lastName: reservee.split(" ")[1] }).lean();
            if (!user) {
                return res.status(404).json({ error: "Reservee not found" });
            }

            const newReservation = new Reservation({
                lab,
                date,
                startTime,
                endTime,
                seats,
                name: reservee,
                isAnonymous,
                email: user.email
            });

            await newReservation.save();
            res.json({ success: true, message: "Reservation successful!" });
        } catch (err) {
            console.error("Error saving reservation:", err);
            res.status(500).json({ error: "Failed to reserve slot." });
        }
    });
}

module.exports.add = add;
