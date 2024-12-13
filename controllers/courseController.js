import CourseService from "../services/courseService.js";

export const getAllCourses = async (req, res) => {
  try {
    const courses = await CourseService.getAllCourses();
    res.status(200).json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCourseById = async (req, res) => {
  const { id } = req.params;
  try {
    const course = await CourseService.getCourseById(id);
    res.status(200).json({ success: true, data: course });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const createCourse = async (req, res) => {
  const { title, description, teacher } = req.body;
  console.log({ title, description, teacher });
  try {
    const result = await CourseService.createCourse(
      title,
      description,
      teacher
    );
    if (!result.success) {
      return res.status(result.status).json({ message: result.message });
    }
    res.status(201).json({ data: result.course });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
