const User = require("../models/User");
const Reservation = require("../models/Reservation");

function add(server) {
    // Render student profile page
    server.get('/profile/:id', async function (req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send("User not found");
            }

            // Fetch reservations for the user
            const reservations = await Reservation.find({ userId }).limit(5);

            res.render('profile', {
                layout: 'index',
                title: 'Student Profile',
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || "/common/default_pfp.jpg",
                reservations: reservations
            });

        } catch (error) {
            console.error("Error loading profile:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
