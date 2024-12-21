const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course")
const CourseProgress = require("../models/CourseProgress")
const {uploadToCloudinary} = require("../utils/UploaderCloudinary");
const cron = require('node-cron');
// require("dotenv").config();
const agenda = require('../config/agenda');
const {convertSecondsToDuration} = require("../utils/secToDuration");


exports.updateProfile = async (req,res) => {
    try {
        const {gender, dateOfBirth="", about="", contactNumber, firstName, lastName} = req.body;

        const id = req.user.id;

        const userDetails = await User.findById(id);

        userDetails.firstName= firstName;
        userDetails.lastName= lastName;

        await userDetails.save();

        const profileId = userDetails.additionalDetails; 

        const profileDetails = await Profile.findById(profileId);

        profileDetails.gender = gender;
        profileDetails.dateOfBirth = dateOfBirth;
        profileDetails.contactNumber = contactNumber;
        profileDetails.about = about;

        

        await profileDetails.save();

        const updatedUserDetails = await User.findById(id).populate("additionalDetails");;

        return res.status(200).json({
            success:true,
            message:"Profile update Successfully",
            updatedUserDetails
        });
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while updating profile",
            error:error.message
        })
    }
};


// exports.deleteAccount = async (req,res) => {
//     try {
//         const id = req.user.id;

//         const userDetails = await User.findById({_id:id});

//         if(!userDetails){
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             })
//         };

//         await Profile.findByIdAndDelete({_id: userDetails.additionalDetails});

//         // TODO: unEnroll user form all enrolled courses 
//         if(userDetails.courses.length > 0){
//           for(let courseId of userDetails.courses){
//             await Course.findByIdAndUpdate(courseId,
//                                             {
//                                                 $pull:{
//                                                   studentsEnrolled:id
//                                                 }
//                                             },
//                                           {new:true}
//                                           )
//           };
//           console.log("In side userDetails.courses delete")
//         }

        

//         // for(let courseProgressId of userDetails.courseProgress){
//         //   await Course.findByIdAndUpdate(courseProgressId,
//         //                                   {
//         //                                       $pull:{
//         //                                         studentsEnrolled:id
//         //                                       }
//         //                                   },
//         //                                 {new:true}
//         //                                 )
//         // };

//         await User.findByIdAndDelete({_id:id});

//         return res.status(200).json({
//             success:true,
//             message:"Account deleted Successfully"
//         });

//     } catch (error) {
//         return res.status(400).json({
//             success:false,
//             message:"User cannot be deleted successfully",
//             error:error.message
//         })
//     }
// };


// Cron
// exports.deleteAccount = async (req, res) => {
//     try {
//         const userId = req.user.id;

//         const userDetails = await User.findById(userId);
//         if (!userDetails) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found"
//             });
//         }

//         // Schedule account deletion after 7 days
//         cron.schedule('0 */1 * * * *', async () => {
//             try {
//                 await Profile.findByIdAndDelete(userDetails.additionalDetails);

//                 // Unenroll user from all enrolled courses
//                 // for (let courseId of userDetails.courses) {
//                 //     await Course.findByIdAndUpdate(courseId, {
//                 //         $pull: { studentsEnrolled: userId }
//                 //     }, { new: true });
//                 // }

//                 // If you need to handle course progress as well, you can uncomment and modify the below code
//                 /*
//                 for (let courseProgressId of userDetails.courseProgress) {
//                     await CourseProgress.findByIdAndUpdate(courseProgressId, {
//                         $pull: { studentsEnrolled: userId }
//                     }, { new: true });
//                 }
//                 */

//                 await User.findByIdAndDelete(userId);

//                 console.log(`Account for user ${userId} deleted successfully.`);
//             } catch (error) {
//                 console.error(`Failed to delete account for user ${userId}:`, error.message);
//             }
//         });

//         return res.status(200).json({
//             success: true,
//             message: "Account deletion scheduled successfully"
//         });
//     } catch (error) {
//         return res.status(400).json({
//             success: false,
//             message: "User cannot be deleted successfully",
//             error: error.message
//         });
//     }
// };


// Agenda
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.user.id;

        const userDetails = await User.findById(userId);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Schedule account deletion after 7 days
        const job = await agenda.schedule('in 7 days', 'delete user account', { userId });

        // const job = await agenda.schedule('in 5 minute', 'delete user account', { userId });

        // console.log(job);
        // console.log(job.attrs.nextRunAt.toString())

        userDetails.deletionJobId = job.attrs._id;
        await userDetails.save();


        return res.status(200).json({
            success: true,
            message: "Account deletion scheduled successfully",
            deleteAt: job.attrs.nextRunAt.toString()
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "User cannot be deleted successfully",
            error: error.message
        });
    }
};



exports.getAllUserDetails = async (req,res) => {
    try {
        const id = req.user.id;

        const userDetails = await User.findById(id).populate('additionalDetails').exec();

        if(!userDetails){
            return res.status(404).json({
                success: false,
                message: "User not found"
            })
        };

        return res.status(200).json({
            success:true,
            message:"User details fatched successfully",
            data: userDetails,
        })


    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Cannot find User details",
            error:error.message
        })
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
      const displayPicture = req.files.displayPicture
      const userId = req.user.id

      const image = await uploadToCloudinary(
        displayPicture,
        process.env.FOLDER_NAME,
      )

      if(!image){
        return res.status(404).json({
          success:false,
          message: "error while image uploading",
        })
      }

      console.log(image)
      const updatedProfile = await User.findByIdAndUpdate(
        { _id: userId },
        { image: image.secure_url },
        { new: true }
      )
      res.send({
        success: true,
        message: `Image Updated successfully`,
        data: updatedProfile,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "error while uploading picture",
        error :error.message,
      })
    }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseId: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round((courseProgressCount / SubsectionLength) * 100 * multiplier ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}