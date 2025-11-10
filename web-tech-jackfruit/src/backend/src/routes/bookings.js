import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

const router = Router();

router.post("/", authRequired, async (req, res) => {
	try {
		const { classId, perWeek } = req.body;
		if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
			return res.status(400).json({ message: "Invalid classId" });
		}
		const booking = await Booking.create({
			user: req.userId,
			class: classId,
			perWeek: perWeek || 1
		});
		return res.status(201).json(booking);
	} catch (err) {
		return res.status(500).json({ message: "Failed to create booking" });
	}
});

router.get("/", authRequired, async (req, res) => {
	const bookings = await Booking.find({ user: req.userId }).populate("class");
	return res.json(bookings);
});

export default router;


