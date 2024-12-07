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
    sections: [
      {
        sectionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Section", 
        },
        progress: {
          type: Number, 
          default: 0,
        },
        completedAt: {
          type: Date,
          default: null,
        },
        exercises: [
          {
            exerciseId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "Exercise",
            },
            status: {
              type: String,
              enum: ["not-started", "in-progress", "completed"],
              default: "not-started",
            },
            score: {
              type: Number,
              default: null,
            },
            feedback: {
              type: String,
              default: null, 
            },
          },
        ],
      },
    ],
    lastAccessedAt: {
      type: Date, // Lần cuối truy cập vào khóa học
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
