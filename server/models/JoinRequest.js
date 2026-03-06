import mongoose from "mongoose";

const joinRequestSchema = new mongoose.Schema(
  {
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("JoinRequest", joinRequestSchema);