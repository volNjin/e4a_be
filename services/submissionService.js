import mongoose from "mongoose";
import Submission from "../models/submission.js";
import Exercise from "../models/exercise.js";
import Section from "../models/Section.js";
import { updateProgressOnExerciseSubmission } from "./progressService.js";

export const createSubmission = async (submissionData) => {
  try {
    const { userId, exercise, score } = submissionData;

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(exercise)
    ) {
      throw new Error("Invalid userId or exerciseId");
    }

    const exerciseDoc = await Exercise.findById(exercise);
    if (!exerciseDoc) {
      throw new Error("Exercise not found");
    }

    // Update progress after submission
    const section = await Section.findOne(exerciseDoc.sectionId);
    await updateProgressOnExerciseSubmission(
      userId,
      section.course,
      exercise,
      score,
    );

    return { success: true };
  } catch (error) {
    throw error;
  }
};

export const getSubmissionById = async (submissionId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new Error("Invalid submissionId");
    }

    const submission = await Submission.findById(submissionId).populate(
      "exercise"
    );
    if (!submission) {
      return { success: false, message: "Submission not found" };
    }
    return { success: true, submission };
  } catch (error) {
    throw error;
  }
};

export const updateSubmission = async (submissionId, updateData) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new Error("Invalid submissionId");
    }

    const submission = await Submission.findByIdAndUpdate(
      submissionId,
      updateData,
      { new: true }
    );
    if (!submission) {
      return { success: false, message: "Submission not found" };
    }
    return { success: true, submission };
  } catch (error) {
    throw error;
  }
};

export const deleteSubmission = async (submissionId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new Error("Invalid submissionId");
    }

    const submission = await Submission.findByIdAndDelete(submissionId);
    if (!submission) {
      return { success: false, message: "Submission not found" };
    }
    return { success: true, message: "Submission deleted successfully" };
  } catch (error) {
    throw error;
  }
};

export const getAllSubmissions = async () => {
  try {
    const submissions = await Submission.find().populate("exercise");
    return { success: true, submissions };
  } catch (error) {
    throw error;
  }
};
