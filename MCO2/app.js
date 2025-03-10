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
const fs = require("fs");
const path = require("path");
const User = require("./models/user");
const Reservation = require("./models/reservation");
const Lab = require("./models/lab");

async function seedData() {
    try {
        const users = JSON.parse(fs.readFileSync(path.join(__dirname, "data/users.json"), "utf-8"));
        const reservations = JSON.parse(fs.readFileSync(path.join(__dirname, "data/reservations.json"), "utf-8"));
        const labs = JSON.parse(fs.readFileSync(path.join(__dirname, "data/labs.json"), "utf-8"));

        // Clear existing data
        await User.deleteMany({});
        await Reservation.deleteMany({});
        await Lab.deleteMany({});

        // Insert new data
        await User.insertMany(users);
        await Reservation.insertMany(reservations);
        await Lab.insertMany(labs);

        console.log("Database successfully seeded");
    } catch (error) {
        console.error("Error seeding data:", error);
    }
}

seedData(); // comment this out to remove auto seeding
// AUTOMATIC SEEDING

const port = process.env.PORT || 9090;
server.listen(port, function(){
    console.log('Listening at port '+port);
});