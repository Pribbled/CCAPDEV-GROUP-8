const User = require("../models/user");
const Reservation = require("../models/reservation");

function add(server) {
    // Render visited profile page
    server.get('/profileVisit/:id', async function (req, res) {
        try {
            const userId = req.params.id;  // Get userId from the URL
            const user = await User.findById(userId);  // Retrieve user from the database

            if (!user) {
                return res.status(404).send("User not found");
            }

            // Fetch last 5 reservations for the visited user
            const reservations = await Reservation.find({ userId: userId }).limit(5).lean();

            res.render('profileVisit', {
                layout: 'index',
                title: 'Profile Visit',
                stylesheet: 'profileVisit',
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                email: user.email,
                profilePicture: user.profilePicture || "/common/defaultPfp.jpg",
                reservations: reservations
            });

        } catch (error) {
            console.error("Error loading profile visit:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
