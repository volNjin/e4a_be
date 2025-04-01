import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expireAt: { type: Date, required: true },
});
OtpSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 });
export default mongoose.model("Otp", OtpSchema);
