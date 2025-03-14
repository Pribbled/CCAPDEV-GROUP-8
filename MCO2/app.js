const express = require('express');
const server = express();

const bodyParser = require('body-parser');
server.use(express.json()); 
server.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
server.set('view engine', 'hbs');
server.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: {
        count: function (array) {
            return array ? array.length : 0;
        },
    },
}));

server.use(express.static('public'));

const controllers = ['routes','reserve','reserveLab', 'login', 'register', 'slots', 'slotsLab', 'profile', 'profileTechnician', 'profileVisit'];
for(var i=0; i<controllers.length; i++){
    const model = require('./controllers/'+controllers[i]);
    model.add(server);
}

const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/ccapdev').then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// AUTOMATIC SEEDING
const fs = require('fs');
const path = require('path');
const User = require('./models/user');
const Reservation = require('./models/reservation');
const Lab = require('./models/lab');

async function seedData() {
    try {
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/users.json'), 'utf-8'));
        const reservations = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/reservations.json'), 'utf-8'));
        const labs = JSON.parse(fs.readFileSync(path.join(__dirname, 'data/labs.json'), 'utf-8'));

        // Clear existing data
        await User.deleteMany({});
        await Reservation.deleteMany({});
        await Lab.deleteMany({});

        // Insert users into the database
        await User.insertMany(users);

        // Insert reservations and link to users directly in the database
        for (const reservation of reservations) {
            const user = await User.findOne({ email: reservation.email });
            if (user) {
                reservation.userId = user._id;  // Link reservation to the user
                await Reservation.create(reservation);
            }
        }

        // Insert labs into the database
        await Lab.insertMany(labs);

        console.log('Database successfully seeded: Reservations linked to users.');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
}

seedData();  // Comment this out to remove auto-seeding
// AUTOMATIC SEEDING

const port = process.env.PORT || 3000;
server.listen(port, function(){
    console.log('Listening at port '+port);
});