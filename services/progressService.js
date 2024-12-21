import Progress from "../models/Progress.js";

export const getProgress = async (user) => {
  try {
    const progress = await Progress.find({ user });
    return progress;
  } catch (error) {
    throw error;
  }
};

export const initProgress = async (userId, courseId) => {
  try {
    const progress = await Progress.findOne({ userId, courseId });
    if (!progress) {
      const newProgress = new Progress({ userId, courseId });
      await newProgress.save();
      return newProgress;
    }
    return progress;
  } catch (error) {
    throw error;
  }
};
