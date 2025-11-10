import { Router } from "express";
import Video from "../models/Video.js";
import Teacher from "../models/Teacher.js";

const router = Router();

router.get("/", async (_req, res) => {
	const count = await Video.countDocuments();
	if (count === 0) {
		const teacher = await Teacher.create({ name: "Asha", bio: "Mindfulness coach", location: "Bengaluru", rating: 4.7, feesPerClass: 350 });
		await Video.create([
			{ title: "Morning Calm", url: "https://www.w3schools.com/html/mov_bbb.mp4", description: "10 min breathing", teacher: teacher._id, avgRating: 4.6 },
			{ title: "Evening Relax", url: "https://www.w3schools.com/html/movie.mp4", description: "Wind down", teacher: teacher._id, avgRating: 4.4 }
		]);
	}
	const videos = await Video.find().populate("teacher", "name rating");
	return res.json(videos);
});

export default router;


