import Progress from '../models/Progress.js';

export const getProgress = async (user) => {
    try {
        const progress = await Progress.find({ user });
        return progress;
    } catch (error) {
        throw error;
    }
}
