const User = require("../models/User");

function add(server) {
    // Render visited profile page
    server.get('/profileVisit/:id', async function (req, res) {
        try {
            const userId = req.params.id;
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).send("User not found");
            }

            res.render('profileVisit', {
                layout: 'index',
                title: 'Profile Visit',
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture || "/common/default_pfp.jpg",
                reservations: user.reservations
            });

        } catch (error) {
            console.error("Error loading profile visit:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
