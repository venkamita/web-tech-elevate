import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

function dateUTCString(d = new Date()) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

function isYesterday(prev, today) {
  const p = new Date(prev + "T00:00:00.000Z");
  const t = new Date(today + "T00:00:00.000Z");
  const diff = Math.round((t - p) / (24 * 60 * 60 * 1000));
  return diff === 1;
}

router.post("/ping", authRequired, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const today = dateUTCString();
  if (user.lastActiveDate === today) {
    return res.json({ streak: user.streak, lastActiveDate: user.lastActiveDate });
  }

  if (user.lastActiveDate && isYesterday(user.lastActiveDate, today)) {
    user.streak = (user.streak || 0) + 1;
  } else {
    user.streak = 1;
  }
  user.lastActiveDate = today;
  await user.save();
  return res.json({ streak: user.streak, lastActiveDate: user.lastActiveDate });
});

export default router;
