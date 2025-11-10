import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
	{
		title: { type: String, required: true },
		url: { type: String, required: true },
		description: { type: String },
		teacher: { type: mongoose.Schema.Types.ObjectId, ref: "Teacher" },
		avgRating: { type: Number, default: 4.4 }
	},
	{ timestamps: true }
);

export default mongoose.model("Video", videoSchema);


