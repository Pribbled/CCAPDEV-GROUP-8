const mongoose = require('mongoose');
const Reservation = require('../models/reservation'); 
const Lab = require('../models/lab'); 

function add(server) {
    server.get('/slotsLab', async function(req, resp) {
        try {
            const labs = await Lab.find().lean(); 
            const reservations = await Reservation.find().lean(); 
            resp.render('slotsLab', {
                layout: 'index',
                title: 'Reservation for Today',
                stylesheet: 'slotsLab',
                labs: labs, 
                reservations: reservations 
            });
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
    
            res.json(filteredData);
        } catch (error) {
            console.error("Error fetching reservations:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

    server.delete('/api/reservations/:id', async (req, res) => {
        try {
            const { id } = req.params;
    
            const reservation = await Reservation.findById(id);
            if (!reservation) {
                return res.status(404).json({ error: "Reservation not found." });
            }
    
            await Reservation.findByIdAndDelete(id);
            res.json({ message: "Reservation removed successfully." });
        } catch (error) {
            console.error("Error removing reservation:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    });

}

module.exports.add = add; 
