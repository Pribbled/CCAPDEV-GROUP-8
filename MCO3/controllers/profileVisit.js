const User = require("../models/user");
const Reservation = require("../models/reservation");

function add(server) {
    // Render visited profile page
    server.get('/profileVisit/:id', async function (req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send("User not found");
            }

            // Fetch last 5 non-anonymous reservations for the visited user using their email
            const reservations = await Reservation.find({ 
                email: user.email, 
                isAnonymous: false 
            }).limit(5).lean();

            // Process reservations to include seat numbers
            const processedReservations = reservations.map(reservation => ({
                ...reservation,
                seatNumbers: reservation.seats.map(seat => seat.seatNumber).join(", ")
            }));

            res.render('profileVisit', {
                layout: 'index',
                title: 'Profile Visit',
                stylesheet: 'profileVisit',
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role,
                email: user.email,
                profilePicture: user.profilePicture || "/common/defaultPfp.jpg",
                reservations: processedReservations
            });

        } catch (error) {
            console.error("Error loading profile visit:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
