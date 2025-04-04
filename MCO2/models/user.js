const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    role: { type: String, enum: ["Student", "Lab Technician"], required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true}, // Primary key for user
    password: { type: String, required: true },
    profilePicture: { type: String, default: "/common/defaultPfp.jpg" },
    session: { type: Date, default: () => new Date(Date.now() + 3 * 7 * 24 * 60 * 60 * 1000) }, // Adds 3 weeks to expiration date
    // no need for sessions pa for phase 2
    reservations: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reservation" }] // References Reservation
}, { timestamps: true });

const User = mongoose.models.users || mongoose.model("users", userSchema);

module.exports = User;