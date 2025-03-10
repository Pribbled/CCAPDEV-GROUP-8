const User = require("../models/user");

function add(server){
    server.get('/', function(req, resp){
        resp.render('main',{
        layout: 'index',
        title: 'Computer Lab Slot Reservation',
        stylesheet: 'home'
        });
    });

    // search query
    server.get('/search', async (req, res) => {
        try {
            const query = req.query.q;
            if (!query) {
                return res.json([]);
            }

            const users = await User.find({
                $or: [
                    { firstName: { $regex: query, $options: "i" } },
                    { lastName: { $regex: query, $options: "i" } }
                ]
            }).limit(5); // result limit

            res.json(users);
        } catch (error) {
            console.error("Search error:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}

module.exports.add = add;