import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { connectDb } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.js";
import videoRoutes from "./src/routes/videos.js";
import teacherRoutes from "./src/routes/teachers.js";
import classRoutes from "./src/routes/classes.js";
import bookingRoutes from "./src/routes/bookings.js";
import profileRoutes from "./src/routes/profile.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/", (_req, res) => {
	res.json({ ok: true, service: "Elevate API" });
});

app.use("/api/auth", authRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/profile", profileRoutes);

const PORT = process.env.PORT || 5000;

connectDb()
	.then(() => {
		app.listen(PORT, () => {
			console.log(`Elevate API running on http://localhost:${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Failed to start server:", err);
		process.exit(1);
	});


