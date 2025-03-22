import mongoose from "mongoose";
import Submission from "../models/submission.js";
import Exercise from "../models/exercise.js";
import Section from "../models/Section.js";
import { updateProgressOnExerciseSubmission } from "./progressService.js";

export const createSubmission = async (submissionData) => {
  try {
    const { userId, exercise, answers, score: clientScore } = submissionData;
    
    if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(exercise)) {
      throw new Error("Invalid userId or exerciseId");
    }

    const exerciseDoc = await Exercise.findById(exercise);
    if (!exerciseDoc) {
      throw new Error("Exercise not found");
    }

    let score = null;
    if (exerciseDoc.type === "speaking") {
      score = clientScore;
    } else {
      score = calculateScore(exerciseDoc, answers);
    }

    const submission = new Submission({ ...submissionData, score });
    await submission.save();

    // Update progress after submission
    const section = await Section.findOne(exerciseDoc.sectionId)
    await updateProgressOnExerciseSubmission(userId, section.course, exercise, "completed", score, null);

    return { success: true, submission };
  } catch (error) {
    throw error;
  }
};

const calculateScore = (exercise, answers) => {
  let score = 0;

  switch (exercise.type) {
    case "multiple-choice":
      const correctAnswers = exercise.options.filter(option => option.isCorrect).map(option => option.text);
      const userAnswers = Array.isArray(answers) ? answers : [answers];
      const allCorrect = correctAnswers.every(answer => userAnswers.includes(answer));
      const noIncorrect = userAnswers.every(answer => correctAnswers.includes(answer));
      score = (allCorrect && noIncorrect) ? 100 : 0;
      break;
    case "single-choice":
      const correctAnswer = exercise.options.find(option => option.isCorrect)?.text;
      score = (answers === correctAnswer) ? 100 : 0;
      break;
    case "fill-in-the-blank":
      const correctBlanks = exercise.correctAnswers;
      const userBlanks = Array.isArray(answers) ? answers : [answers];
      const correctBlanksCount = userBlanks.filter(answer => correctBlanks.includes(answer)).length;
      score = (correctBlanksCount / correctBlanks.length) * 100;
      break;
    default:
      throw new Error("Unknown exercise type");
  }

  return score;
};

export const getSubmissionById = async (submissionId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(submissionId)) {
      throw new Error("Invalid submissionId");
    }

    const submission = await Submission.findById(submissionId).populate("exercise");
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

    const submission = await Submission.findByIdAndUpdate(submissionId, updateData, { new: true });
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