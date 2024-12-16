import CourseService from "../services/courseService.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseService.getAllCourses();
    res.status(200).json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCourses = async (req, res) => {
  try {
    const user = req.user;
    const courses = await CourseService.getMyCourses(user);
    res.status(200).json({ data: courses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await CourseService.getCourseById(id);
    res.status(200).json({ data: course });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createCourse = async (req, res) => {
  try {
    const { title, description, image } = req.body;
    const teacherId = req.user?.id; // Extract teacher ID from token
    const result = await CourseService.createCourse(
      title,
      description,
      image,
      teacherId
    );
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(201).json({ data: result.course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
