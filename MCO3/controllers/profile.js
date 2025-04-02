const User = require("../models/user");
const Reservation = require("../models/reservation");

function add(server) {
    // Render student profile page
    server.get('/profile', async function (req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send("User not found");
            }

            // Fetch reservations for the user
            const reservations = await Reservation.find({
                email: user.email,
            }).lean();

            const processedReservations = reservations.map(reservation => ({
                ...reservation,
                seatNumbers: reservation.seats.map(seat => seat.seatNumber).join(", ")
            }));

            res.render('profile', {
                layout: 'index',
                title: 'My Profile',
                stylesheet: 'profile',
                name: `${user.firstName} ${user.lastName}`,
                email: user.email,
                profilePicture: "/common/default_pfp.jpg",
                reservations: processedReservations
            });

        } catch (error) {
            console.error("Error loading profile:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
