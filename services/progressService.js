import mongoose from "mongoose";
import Progress from "../models/Progress.js";
import Course from "../models/Course.js";
import Section from "../models/Section.js";
import Exercise from "../models/exercise.js";

export const getAllProgress = async (userId) => {
  try {
    const progress = await Progress.find({ userId });
    return progress;
  } catch (error) {
    throw error;
  }
}

export const getProgress = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      return { success: false, message: "Progress not found" };
    }
    return {success: true, progress: progress};
  } catch (error) {
    throw error;
  }
};

export const initProgress = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (progress) {
      return { success: false, message: "Progress already exists" };
    }
    const newProgress = new Progress({ userId, courseId });
    await newProgress.save();
    return { success: true, newProgress };
  } catch (error) {
    throw error;
  }
};

export const markLastAccessedSection = async (userId, courseId, sectionId) => {
  try {
    const updatedProgress = await Progress.findOneAndUpdate(
      { userId, courseId },
      { lastAccessedSection: sectionId, lastAccessedAt: Date.now() },
      { new: true }
    );
  } catch (error) {
    throw error;
  }
};

export const updateProgressOnExerciseSubmission = async (
  userId,
  courseId,
  exerciseId,
  status,
  score,
  feedback
) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      throw new Error("Progress not found");
    }

    const exercise = progress.exercises.find(
      (ex) => ex.exerciseId.toString() === exerciseId
    );
    if (exercise) {
      exercise.status = status;
      exercise.score = score;
      exercise.feedback = feedback;
    } else {
      progress.exercises.push({ exerciseId, status, score, feedback });
    }

    await progress.save();
    const calculated = await calculateProgress(userId, courseId);
    return calculated;
  } catch (error) {
    throw error;
  }
};

export const updateProgressOnSectionCompletion = async (
  userId,
  courseId,
  sectionId
) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      throw new Error("Progress not found");
    }

    const section = progress.sections.find(
      (sec) => sec.sectionId.toString() === sectionId
    );
    if (section) {
      section.completedAt = new Date();
    } else {
      progress.sections.push({ sectionId, completedAt: new Date() });
    }
    await progress.save();
    await markLastAccessedSection(userId, courseId, sectionId);
    const calculated = await calculateProgress(userId, courseId);
    return calculated;
  } catch (error) {
    throw error;
  }
};

const calculateProgress = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    const course = await Course.findById(courseId).populate({
      path: "sections",
      populate: {
        path: "exercises",
      },
    });

    if (!progress || !course) {
      throw new Error("Progress or Course not found");
    }

    const totalSections = course.sections.length;
    const totalExercises = course.sections.reduce(
      (acc, section) => acc + section.exercises.length,
      0
    );
    const completedSections = progress.sections.filter(
      (sec) => sec.completedAt
    ).length;
    const completedExercises = progress.exercises.filter(
      (ex) => ex.status === "completed"
    ).length;

    const totalItems = totalSections + totalExercises;
    const completedItems = completedSections + completedExercises;

    const progressPercentage = (completedItems / totalItems) * 100;
    progress.progress = progressPercentage;
    await progress.save();
    return progress;
  } catch (error) {
    throw error;
  }
};
