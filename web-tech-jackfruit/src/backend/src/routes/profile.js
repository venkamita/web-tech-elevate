import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

router.get("/", authRequired, async (req, res) => {
	const user = await User.findById(req.userId).select("name email location streak");
	return res.json(user);
});

router.put("/", authRequired, async (req, res) => {
	const { name, location } = req.body;
	const user = await User.findByIdAndUpdate(req.userId, { name, location }, { new: true }).select("name email location streak");
	return res.json(user);
});

export default router;


