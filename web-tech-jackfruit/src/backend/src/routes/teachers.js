import { Router } from "express";
import Teacher from "../models/Teacher.js";
import ClassModel from "../models/Class.js";

const router = Router();

router.get("/", async (_req, res) => {
	const count = await Teacher.countDocuments();
	if (count === 0) {
		const t1 = await Teacher.create({ name: "Asha", bio: "Mindfulness coach", location: "Bengaluru", rating: 4.7, feesPerClass: 350 });
		const t2 = await Teacher.create({ name: "Ravi", bio: "Hatha Yoga", location: "Mysuru", rating: 4.5, feesPerClass: 300 });
		await ClassModel.create([
			{ teacher: t1._id, title: "Mindful Mornings", location: "Indiranagar", schedule: "Mon/Wed/Fri 6-7 AM" },
			{ teacher: t2._id, title: "Evening Hatha", location: "JP Nagar", schedule: "Tue/Thu 7-8 PM" }
		]);
	}
	const teachers = await Teacher.find();
	return res.json(teachers);
});

router.get("/:teacherId/classes", async (req, res) => {
	const classes = await ClassModel.find({ teacher: req.params.teacherId });
	return res.json(classes);
});

export default router;


