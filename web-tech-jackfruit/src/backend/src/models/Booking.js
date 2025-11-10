import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
	{
		user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		class: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
		perWeek: { type: Number, default: 2 },
		status: { type: String, default: "confirmed" }
	},
	{ timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);


