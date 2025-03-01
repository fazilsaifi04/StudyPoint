const RatingAndReview = require("../models/RatingandReview")
const Course = require("../models/Course")
const mongoose = require("mongoose")

exports.createRating = async (req, res) => {
  try{

      const userId = req.user.id;
      const {rating, review, courseId} = req.body;
      const courseDetails = await Course.findOne(
                                  {_id:courseId,
                                  studentsEnrolled: {$elemMatch: {$eq: userId} },
                              });

      if(!courseDetails) {
          return res.status(404).json({
              success:false,
              message:'Student is not enrolled in the course',
          });
      }
      const alreadyReviewed = await RatingAndReview.findOne({
                                              user:userId,
                                              course:courseId,
                                          });
      if(alreadyReviewed) {
                  return res.status(403).json({
                      success:false,
                      message:'Course is already reviewed by the user',
                  });
              }
      const ratingReview = await RatingAndReview.create({
                                      rating, review, 
                                      course:courseId,
                                      user:userId,
                                  });
     
      const updatedCourseDetails = await Course.findByIdAndUpdate({_id:courseId},
                                  {
                                      $push: {
                                          ratingAndReviews: ratingReview._id,
                                      }
                                  },
                                  {new: true});
      console.log(updatedCourseDetails);
      
      return res.status(200).json({
          success:true,
          message:"Rating and Review created Successfully",
          ratingReview,
      })
  }
  catch(error) {
      console.log(error);
      return res.status(500).json({
          success:false,
          message:error.message,
      })
  }
}

exports.getAverageRating = async (req, res) => {
  try {
    const courseId = req.body.courseId

    const result = await RatingAndReview.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId), // Convert courseId to ObjectId
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ])

    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      })
    }

    return res.status(200).json({ success: true, averageRating: 0 })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating for the course",
      error: error.message,
    })
  }
}

exports.getAllRatingReview = async (req, res) => {
  try {
    const allReviews = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image", 
      })
      .populate({
        path: "course",
        select: "courseName", 
      })
      .exec()

    res.status(200).json({
      success: true,
      data: allReviews,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve the rating and review for the course",
      error: error.message,
    })
  }
}
