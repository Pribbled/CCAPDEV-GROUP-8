const User = require("../models/user");
const Reservation = require("../models/reservation");

function add(server) {
    // Render visited profile page
    server.get('/profileVisit', async function (req, res) {
        try {
            // const userId = req.params.id;
            // const user = await User.findById(userId);

            // if (!user) {
            //     return res.status(404).send("User not found");
            // }

            // Fetch last 5 reservations for the visited user
            const reservations = await Reservation.find().limit(5).lean();

            res.render('profileVisit', {
                layout: 'index',
                title: 'Profile Visit',
                stylesheet: 'profileVisit',
                name: 'FirstName LastName', //user.name,
                email: 'sample@example.com', //user.email,
                profilePicture: "/common/default_pfp.jpg",
                reservations: reservations
            });

        } catch (error) {
            console.error("Error loading profile visit:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
