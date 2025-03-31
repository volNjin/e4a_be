import mongoose from "mongoose";

const ProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    progress: {
      type: Number,
      default: 0,
    },
    sections: [
      {
        sectionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Section",
        },
        completedAt: {
          type: Date,
          default: null,
        },
      },
    ],
    exercises: [
      {
        exerciseId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Exercise",
        },
        score: {
          type: Number,
          default: null,
        },
      },
    ],
    lastAccessedSection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Section",
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Progress", ProgressSchema);
