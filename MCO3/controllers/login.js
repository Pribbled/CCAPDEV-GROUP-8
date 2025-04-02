const User = require("../models/user");
const bcrypt = require('bcrypt');

function add(server){
    server.get('/login', function(req, resp){
        resp.render('login',{
        layout: 'index',
        title: 'Log In',
        stylesheet: 'login'
        });
    });

    server.post('/login', async function(req, resp) {
        try {
            console.log("Received Data:", req.body);
            const { email, password } = req.body;
    
            const user = await User.findOne({ email });

            if (!user || !(await bcrypt.compare(password, user.password))) {
                return resp.status(401).json({ message: "Invalid email or password" });
            }

            req.session.user = {
                _id: user._id,
                name: user.firstName + " " + user.lastName,
                email: user.email,
                role: user.role,
                profilePicture: user.profilePicture,
                firstName: user.firstName,
                lastName: user.lastName
            };

            console.log("Session created:", req.session.user);

            return resp.status(200).json({ message: "Login successful" });
        } catch (error) {
            console.error("Login error:", error);
            resp.status(500).json({ message: "Internal Server Error" });
        }
    });
    
}

module.exports.add = add;