const User = require("../models/user");
const Reservation = require("../models/reservation");
const Lab = require("../models/lab");

function add(server) {
    // Render student profile page
    server.get('/profile', async function (req, res) {
        try {
            if(!req.session.user) {
                return res.redirect('/login');
            }
            // const userId = req.params.id;
            // const user = await User.findById(userId);

            // if (!user) {
            //     return res.status(404).send("User not found");
            // }

            const {name, firstName, lastName, email, role, profilePicture} = req.session.user;

            const reservations = await Reservation.find({
                email: email,
            }).lean();
            const labs = await Lab.find().lean();

            const processedReservations = reservations.map(reservation => ({
                ...reservation,
                seatNumbers: reservation.seats.map(seat => seat.seatNumber).join(", ")
            }));

            if(role === 'Student') {
                res.render('profile', {
                    layout: 'index',
                    title: 'Student Profile',
                    stylesheet: 'profile',
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    profilePicture: profilePicture,
                    reservations: reservations,
                    labs: labs,
                });
            } else {
                res.render('profileTechnician', {
                    layout: 'index',
                    title: 'Technician Profile',
                    stylesheet: 'profileTechnician',
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    profilePicture: profilePicture,
                    reservations: reservations
                });    
            }

        } catch (error) {
            console.error("Error loading profile:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    function convertTo12HourFormat(time) {
        const [hours, minutes] = time.split(":").map(Number);
        const suffix = hours >= 12 ? "PM" : "AM";
        const formattedHours = String(((hours + 11) % 12 + 1)).padStart(2, "0"); // Ensures two digits
        return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${suffix}`;
    }

    server.post('/profile/edit-reservation', async (req, res) => {
        try {
            const { reservationId, lab, date, startTime, seats, isAnonymous } = req.body;
            
            let reservation = await Reservation.findById(reservationId);
            if (!reservation) {
                return res.status(404).json({ error: "Reservation not found" });
            }

            const formattedStartTime = convertTo12HourFormat(startTime);

            function parse12HourToDate(timeStr) {
                const [time, modifier] = timeStr.split(" ");
                let [hours, minutes] = time.split(":").map(Number);
    
                if (modifier === "PM" && hours !== 12) hours += 12;
                if (modifier === "AM" && hours === 12) hours = 0;
    
                return new Date(0, 0, 0, hours, minutes);
            }

            function formatTo12Hour(dateObj) {
                let hours = dateObj.getHours();
                let minutes = dateObj.getMinutes();
                let ampm = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12;
                minutes = String(minutes).padStart(2, "0");
                hours = String(hours).padStart(2, "0");
            
                return `${hours}:${minutes} ${ampm}`;
            }

            let startDate = parse12HourToDate(formattedStartTime);
            let endDate = new Date(startDate.getTime() + 30 * 60000);
            let formattedEndTime = formatTo12Hour(endDate);

            
            const existingReservations = await Reservation.find({
                lab,
                date,
                startTime: formattedStartTime,
                _id: { $ne: reservationId }
            });

            console.log(existingReservations);
            
            let reservedSeats = new Set(existingReservations.flatMap(r => r.seats.map(s => s.seatNumber)));

            let requestedSeats = new Set(seats.map(seat => Number(seat)));

            for (let seat of requestedSeats) {
                if (reservedSeats.has(seat)) {
                    return res.status(400).json({ error: `Seat ${seat} is already reserved.` });
                }
            }
            
            reservation.lab = lab;
            reservation.date = date;
            reservation.startTime = formattedStartTime;
            reservation.endTime = formattedEndTime;
            reservation.seats = seats.map(seatNumber => ({ seatNumber, status: "Reserved" }));
            reservation.isAnonymous = isAnonymous || false;
            reservation.requestDate = new Date().toISOString().split('T')[0];
            
            await reservation.save();
            res.status(200).json({ message: "Reservation updated successfully." });
        } catch (error) {
            console.error("Error updating reservation:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    server.post('/profile/cancel-reservation', async (req, res) => {
        try {
            const { reservationId } = req.body;
            const deletedReservation = await Reservation.findByIdAndDelete(reservationId);
            
            if (!deletedReservation) {
                return res.status(404).json({ error: "Reservation not found" });
            }
            
            res.status(200).json({ message: "Reservation canceled successfully" });
        } catch (error) {
            console.error("Error canceling reservation:", error);
            res.status(500).send("Internal Server Error");
        }
    });

    // Update profile pic
    server.post('/profile/update-picture', async (req, res) => {
        try {
            if (!req.session.user) {
                return res.redirect('/login');
            }
    
            const { profilePicture } = req.body; // Get the profile picture URL from the body
            const allowedSources = [
                'https://upload.wikimedia.org',
                'https://example.com' // Add any other allowed sources here
            ];
    
            // Check if the URL starts with one of the allowed sources
            const isValidSource = allowedSources.some(source => profilePicture.startsWith(source));
    
            if (!isValidSource) {
                return res.status(400).json({ error: 'Invalid profile picture source.' });
            }
    
            // Update the user's profile picture in the database
            const user = await User.findOne({ email: req.session.user.email });
            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }
    
            user.profilePicture = profilePicture; // Update profile picture
            await user.save();
    
            // Update the session data
            req.session.user.profilePicture = profilePicture;
    
            res.status(200).json({ message: 'Profile picture updated successfully' });
        } catch (error) {
            console.error("Error updating profile picture:", error);
            res.status(500).send("Internal Server Error");
        }
    });

     // Update name
     server.post('/profile/update-name', async (req, res) => {
        try {
            console.log("Session data before update:", req.session);
    
            if (!req.session.user) {
                return res.status(401).send("Unauthorized: User not logged in");
            }
    
            const { firstName, lastName } = req.body;
            console.log("Updating user:", { id: req.session.user._id, firstName, lastName });
    
            const user = await User.findByIdAndUpdate(
                req.session.user._id,
                { firstName, lastName },
                { new: true }
            );
    
            if (!user) {
                return res.status(404).send("User not found");
            }
    
            // Update session data
            req.session.user.firstName = user.firstName;
            req.session.user.lastName = user.lastName;
            
            console.log("Session data after update:", req.session);
    
            res.redirect('/profile');
        } catch (error) {
            console.error("Error updating name:", error);
            res.status(500).send("Internal Server Error");
        }
    });
}

module.exports.add = add;
