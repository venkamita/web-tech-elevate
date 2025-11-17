import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";
import ClassModel from "../models/Class.js";

const router = Router();

router.post("/", authRequired, async (req, res) => {
	try {
		const { classId, perWeek } = req.body;
		if (!classId || !mongoose.Types.ObjectId.isValid(classId)) {
			return res.status(400).json({ message: "Invalid classId" });
		}

		// Prevent duplicate booking for the same teacher
		const selectedClass = await ClassModel.findById(classId).lean();
		if (!selectedClass) {
			return res.status(404).json({ message: "Class not found" });
		}
		const sameTeacherClassIds = await ClassModel.find({ teacher: selectedClass.teacher }).distinct("_id");
		const existing = await Booking.exists({ user: req.userId, class: { $in: sameTeacherClassIds } });
		if (existing) {
			return res.status(409).json({ message: "You already booked a class with this teacher." });
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
    const bookings = await Booking.find({ user: req.userId })
        .populate({ path: "class", populate: { path: "teacher", select: "name location rating" } });
    return res.json(bookings);
});

export default router;
