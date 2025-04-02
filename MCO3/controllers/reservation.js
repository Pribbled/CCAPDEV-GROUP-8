// const Reservation = require('../models/reservation');
// const Lab = require('../models/lab');

// module.exports = {
//   // CREATE Reservation
//   create: async (req, res) => {
//     try {
//       const { lab, date, startTime, endTime, seats, name, email, isAnonymous } = req.body;
      
//       // Validate seat availability
//       const existingReservations = await Reservation.find({ lab, date, startTime });
//       const reservedSeats = existingReservations.flatMap(r => r.seats.map(s => s.seatNumber));
      
//       const invalidSeats = seats.filter(seat => reservedSeats.includes(seat.seatNumber));
//       if (invalidSeats.length > 0) {
//         return res.status(400).json({ 
//           error: `Seats ${invalidSeats.map(s => s.seatNumber).join(', ')} are already reserved`
//         });
//       }

//       const reservation = await Reservation.create({
//         lab,
//         date,
//         startTime,
//         endTime,
//         seats,
//         name,
//         email,
//         isAnonymous
//       });

//       res.status(201).json(reservation);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // READ All Reservations
//   getAll: async (req, res) => {
//     try {
//       const reservations = await Reservation.find().populate('lab');
//       res.json(reservations);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // READ Single Reservation
//   getById: async (req, res) => {
//     try {
//       const reservation = await Reservation.findById(req.params.id);
//       if (!reservation) return res.status(404).json({ error: "Not found" });
//       res.json(reservation);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // UPDATE Reservation
//   update: async (req, res) => {
//     try {
//       const updated = await Reservation.findByIdAndUpdate(
//         req.params.id,
//         req.body,
//         { new: true }
//       );
//       if (!updated) return res.status(404).json({ error: "Not found" });
//       res.json(updated);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   },

//   // DELETE Reservation
//   delete: async (req, res) => {
//     try {
//       const deleted = await Reservation.findByIdAndDelete(req.params.id);
//       if (!deleted) return res.status(404).json({ error: "Not found" });
//       res.json({ message: "Deleted successfully" });
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   }
// };