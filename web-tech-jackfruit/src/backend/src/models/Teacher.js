import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		bio: { type: String },
		location: { type: String },
		rating: { type: Number, default: 4.5 },
		feesPerClass: { type: Number, default: 300 }
	},
	{ timestamps: true }
);

export default mongoose.model("Teacher", teacherSchema);


