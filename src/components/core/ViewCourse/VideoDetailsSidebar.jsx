import { useEffect, useState } from "react";
import { BsChevronDown } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import { FaAngleDoubleRight } from "react-icons/fa";

export default function VideoDetailsSidebar({ setReviewModal }) {
  const [activeStatus, setActiveStatus] = useState("");
  const [videoBarActive, setVideoBarActive] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { sectionId, subSectionId } = useParams();
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  useEffect(() => {
    if (!courseSectionData.length) return;
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    );
    const currentSubSectionIndx = courseSectionData?.[currentSectionIndx]?.subSection.findIndex(
      (data) => data._id === subSectionId
    );
    if (currentSectionIndx === -1 || currentSubSectionIndx === -1) return;
    const activeSubSectionId =
      courseSectionData[currentSectionIndx]?.subSection?.[currentSubSectionIndx]?._id;
    setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
    setVideoBarActive(activeSubSectionId);
  }, [courseSectionData, sectionId, subSectionId]);

  return (
    <>
      <div className="fixed top-3 left-3 z-50 md:hidden">
        <FaAngleDoubleRight
          onClick={() => setShowSidebar(!showSidebar)}
          className="md:hidden z-10 cursor-pointer text-2xl text-richblack-900 m-2 bg-richblack-100 rounded-full p-1 top-3 absolute -left-1"
        />
      </div>

      <div
        className={`fixed md:relative h-screen bg-richblack-800 border-r border-richblack-700 transition-all duration-300 md:block z-40 overflow-hidden ${
          showSidebar ? "w-full max-w-[320px]" : "hidden md:w-[320px]"
        }`}
      >
        <div className="mx-5 flex flex-col gap-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
          <div className="flex w-full items-center justify-between">
            <div
              onClick={() => {
                if (showSidebar) {
                  setShowSidebar(false);
                } else {
                  navigate(-1);
                }
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 cursor-pointer"
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn text="Add Review" customClasses="ml-auto" onclick={() => setReviewModal(true)} />
          </div>
          <div className="flex flex-col">
            <p>{courseEntireData?.courseName}</p>
            <p className="text-sm font-semibold text-richblack-500">
              {completedLectures?.length} / {totalNoOfLectures} Lectures Completed
            </p>
          </div>
        </div>

        <div className="h-[calc(100vh-5rem)] overflow-y-auto px-2">
          {courseSectionData.map((course, index) => (
            <div key={index}>
              <div
                className="flex justify-between bg-richblack-600 px-5 py-4 cursor-pointer"
                onClick={() => setActiveStatus(course?._id)}
              >
                <p className="w-[70%] font-semibold text-white">{course?.sectionName}</p>
                <BsChevronDown
                  className={`transition-transform duration-300 ${
                    activeStatus === course?._id ? "rotate-180" : "rotate-0"
                  }`}
                />
              </div>

              {activeStatus === course?._id && (
                <div className="transition-[height] duration-500 ease-in-out">
                  {course.subSection.map((topic, i) => (
                    <div
                      key={i}
                      className={`flex gap-3 px-5 py-2 cursor-pointer font-semibold text-white border-b border-richblack-600 ${
                        videoBarActive === topic._id ? "bg-yellow-200" : "hover:bg-richblack-900"
                      }`}
                      onClick={() => {
                        navigate(
                          `/view-course/${courseEntireData?._id}/section/${course?._id}/sub-section/${topic?._id}`
                        );
                        setVideoBarActive(topic._id);
                        setShowSidebar(false);
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={completedLectures.includes(topic?._id)}
                        readOnly={true}
                      />
                      {topic.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
