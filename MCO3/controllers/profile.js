const User = require("../models/user");
const Reservation = require("../models/reservation");

function add(server) {
    // Render student profile page
    server.get('/profile', async function (req, res) {
        try {
            // const userId = req.params.id;
            // const user = await User.findById(userId);

            // if (!user) {
            //     return res.status(404).send("User not found");
            // }

            // Fetch reservations for the user

            if(!req.session.user) {
                return res.redirect('/login');
            }

            const {name, email, role} = req.session.user;

        
            const reservations = await Reservation.find().limit(5).lean();
            if(role === 'Student') {
                res.render('profile', {
                    layout: 'index',
                    title: 'Student Profile',
                    stylesheet: 'profile',
                    name: name,
                    email: email, //user.email,
                    profilePicture: "/common/default_pfp.jpg",
                    reservations: reservations
                });
            } else {
                res.render('profileTechnician', {
                    layout: 'index',
                    title: 'Technician Profile',
                    stylesheet: 'profileTechnician',
                    name: name, //user.name,
                    email: email, //user.email,
                    profilePicture: "/common/default_pfp.jpg",
                    reservations: reservations
                });    
            }

        } catch (error) {
            console.error("Error loading profile:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
