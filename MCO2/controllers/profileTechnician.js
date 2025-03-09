const User = require("../models/User");
const Reservation = require("../models/Reservation");

function add(server) {
    // Render technician profile page
    server.get('/technicianProfile/:id', async function (req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            // Ensure the user exists and is a technician
            if (!user || user.role !== "technician") {
                return res.status(404).send("Technician not found");
            }

            // Fetch all reservations for labs managed by this technician
            const reservations = await Reservation.find({ labTechnicianId: userId }).sort({ date: -1 });

            res.render('technicianProfile', {
                layout: 'index',
                title: 'Technician Profile',
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || "/common/default_pfp.jpg",
                reservations: reservations
            });

        } catch (error) {
            console.error("Error loading technician profile:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
