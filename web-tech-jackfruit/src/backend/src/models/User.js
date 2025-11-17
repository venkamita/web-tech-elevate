import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    location: { type: String },
    streak: { type: Number, default: 0 },
    lastActiveDate: { type: String, default: null } // YYYY-MM-DD in UTC
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
