import mongoose from "mongoose";

export async function connectDb() {
	const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/elevate";
	mongoose.set("strictQuery", true);
	await mongoose.connect(mongoUri, {
		serverSelectionTimeoutMS: 10000
	});
	console.log("MongoDB connected");
}


