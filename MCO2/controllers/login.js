const User = require("../models/User");

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
    
            if (!user || user.password !== password) {
                return resp.status(401).json({ message: "Invalid email or password" });
            }
    
            // Just send a success response
            return resp.status(200).json({ message: "Login successful" });
    
        } catch (error) {
            console.error("Login error:", error);
            resp.status(500).json({ message: "Internal Server Error" });
        }
    });
    
}

module.exports.add = add;