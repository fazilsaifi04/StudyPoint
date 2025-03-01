const mongoose = require("mongoose");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body;
  const userId = req.user.id;

  try {
    if (!courseId || !subsectionId) {
      return res.status(400).json({ error: "Course ID and Subsection ID are required." });
    }

    const subsection = await SubSection.findById(subsectionId);
    if (!subsection) {
      return res.status(404).json({ error: "Subsection not found." });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: "Course not found." });
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: userId,
        completedVideos: [],
      });
    }

    if (courseProgress.completedVideos.includes(subsectionId)) {
      return res.status(400).json({ error: "Subsection already completed." });
    }

    courseProgress.completedVideos.push(subsectionId);

    await courseProgress.save();

    return res.status(200).json({ message: "Course progress updated successfully." });
  } catch (error) {
    console.error("Error in updateCourseProgress:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body;
//   const userId = req.user.id;

//   try {
//     if (!courseId) {
//       return res.status(400).json({ error: "Course ID is required." });
//     }

//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     }).populate({
//       path: "courseID",
//       populate: {
//         path: "courseContent",
//         populate: {
//           path: "subSection",
//         },
//       },
//     });

//     if (!courseProgress) {
//       return res.status(404).json({ error: "Course progress not found." });
//     }

//     let lectures = 0;
//     if (courseProgress.courseId.courseContent) {
//       courseProgress.courseId.courseContent.forEach((section) => {
//         if (section.subSection) {
//           lectures += section.subSection.length;
//         }
//       });
//     }

//     let progressPercentage = 0;
//     if (lectures > 0) {
//       progressPercentage = (courseProgress.completedVideos.length / lectures) * 100;
//       progressPercentage = Math.round(progressPercentage * 100) / 100;
//     }

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Course progress fetched successfully.",
//     });
//   } catch (error) {
//     console.error("Error in getProgressPercentage:", error);
//     return res.status(500).json({ error: "Internal server error." });
//   }
// };