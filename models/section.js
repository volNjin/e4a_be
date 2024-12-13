import mongoose from "mongoose";

const SectionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Section" },
    order: { type: Number, required: true },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
    exercises: [{ type: mongoose.Schema.Types.ObjectId, ref: "Exercise" }],
  },
  { timestamps: true }
);

export default mongoose.model("Section", SectionSchema);
