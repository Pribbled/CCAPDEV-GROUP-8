const User = require("../models/user");
const Reservation = require("../models/reservation");

function add(server) {
    server.get('/profileTechnician', async function (req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user || user.role !== "technician") {
                return res.status(404).send("Technician not found");
            }

            // Fetch walk-in reservations for the technician's lab
            const reservations = await Reservation.find().limit(5).lean();
            res.render('profileTechnician', {
                layout: 'index',
                title: 'Technician Profile',
                stylesheet: 'profileTechnician',
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                profilePicture: "/common/default_pfp.jpg",
                reservations: reservations
            });

        } catch (error) {
            console.error("Error loading technician profile:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
