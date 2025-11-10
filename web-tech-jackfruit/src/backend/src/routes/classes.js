import { Router } from "express";
import ClassModel from "../models/Class.js";
import Teacher from "../models/Teacher.js";

const router = Router();

router.get("/", async (_req, res) => {
	try {
		// Seed minimal data if empty so booking/selection always has options
		const count = await ClassModel.countDocuments();
		if (count === 0) {
			let asha = await Teacher.findOne({ name: "Asha" });
			if (!asha) {
				asha = await Teacher.create({
					name: "Asha",
					bio: "Mindfulness coach",
					location: "Bengaluru",
					rating: 4.7,
					feesPerClass: 350
				});
			}
			await ClassModel.create([
				{ teacher: asha._id, title: "Mindful Mornings", location: "Indiranagar", schedule: "Mon/Wed/Fri 6-7 AM" },
				{ teacher: asha._id, title: "Calm Evenings", location: "Indiranagar", schedule: "Tue/Thu 7-8 PM" }
			]);
		}
		const classes = await ClassModel.find().populate("teacher", "name location rating");
		return res.json(classes);
	} catch (err) {
		return res.status(500).json({ message: "Failed to load classes" });
	}
});

export default router;


