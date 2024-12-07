import mongoose from "mongoose";

const RftkSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Rftk", RftkSchema);
