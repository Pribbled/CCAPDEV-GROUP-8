const mongoose = require('mongoose');
const Reservation = require('../models/reservation'); 
const Lab = require('../models/lab'); 
const User = require('../models/user');

function add(server) {
    server.get('/slots', async function(req, resp) {
        try {

            if(!req.session.user) {
                return resp.redirect('/login');
            }
            const {name, email, role} = req.session.user;

            const labs = await Lab.find().lean(); 
            const reservations = await Reservation.find().lean(); 
            if(role === 'Student') {
                resp.render('slots', {
                    layout: 'index',
                    title: 'Slot Availability',
                    stylesheet: 'slots',
                    labs: labs, 
                    reservations: reservations 
                });
            } else {
                resp.render('slotsLab', {
                    layout: 'index',
                    title: 'Reservation for Today',
                    stylesheet: 'slotsLab',
                    labs: labs, 
                    reservations: reservations 
                });
            }
        } catch (error) {
            console.error('Error loading data:', error);
            resp.status(500).send('Internal Server Error');
        }
    });

    server.get('/api/reservations', async (req, res) => {
        try {
            const { lab, date, startTime } = req.query;
    
            if (!lab || !date || !startTime) {
                return res.status(400).json({ error: "Missing required query parameters." });
            }
    
            const filteredData = await Reservation.find({ lab, date, startTime }).lean();
    
            const enhancedData = await Promise.all(filteredData.map(async (reservation) => {
                if (!reservation.isAnonymous) {
                    const user = await User.findOne({ email: reservation.email }).lean();
                    if (user) {
                        reservation.userId = user._id;
                    }
                }
                return reservation;
            }));
    
            res.json(enhancedData);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    server.get('/api/labs', async (req, res) => {
        const labs = await Lab.find().lean(); 
        res.json(labs);
    });
    
}

module.exports.add = add; 
