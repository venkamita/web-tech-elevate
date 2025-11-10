import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
	{
		teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher", required: true },
		title: { type: String, required: true },
		location: { type: String },
		schedule: { type: String, required: true } // e.g. "Mon/Wed/Fri 6-7 PM"
	},
	{ timestamps: true }
);

export default mongoose.model("Class", classSchema);


