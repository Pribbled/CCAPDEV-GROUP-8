const User = require('../models/user');
const bcrypt = require("bcrypt");

function add(server){
    server.get('/register', function(req, resp){
        resp.render('register',{
        layout: 'index',
        title: 'Register',
        stylesheet: 'register'
        });
    });

    server.post('/register', async function(req, resp) {
        try {
            console.log("Received Data:", req.body); 
            const { role, firstName, lastName, email, password } = req.body;

            // user alr exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                console.log("User already exists:", existingUser);
                return resp.status(400).send('Email already registered.');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            // create and save
            const newUser = new User({ role, firstName, lastName, email, password: hashedPassword });
            await newUser.save();
            console.log("User saved:", newUser);

            resp.status(201).json({ message: 'User registered successfully!' });
        } catch (err) {
            console.error(err);
            resp.status(500).json({ message: 'Error registering user.' });
        }
    });
}

module.exports.add = add;