import React, { useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import CourseCard from "./CourseCard";
import { AuthContext } from "../../context/AuthContext";

const HomePage = () => {
  const {
    courses,
    handleEnrollClick,
    enrolledCourses,
    loadingCourses,
    loggedInUser,
  } = useContext(AuthContext);

  const coursesSectionRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.scrollToCourses && coursesSectionRef.current) {
      coursesSectionRef.current.scrollIntoView({ behavior: "auto" });
      navigate(location.pathname, { replace: true, state: {} });
    } else if (
      location.hash === "#courses-section" &&
      coursesSectionRef.current
    ) {
      coursesSectionRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [location, coursesSectionRef, navigate]);

  const onEnrollButtonClick = (courseName) => {
    handleEnrollClick(courseName);
    if (!loggedInUser || loggedInUser.role !== "student") {
      navigate("/login/student", { state: { fromEnrollment: true } });
    } else {
      navigate("/student/enroll");
    }
  };

  return (
    <main className="p-8 text-center flex-grow">
      <div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          From Confusion to Clarity — DoubtDesk
        </h1>
        <div className="flex flex-col md:flex-row mt-12 bg-white rounded-lg shadow-md max-w-6xl mx-auto overflow-hidden">
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <h1 className="text-lg text-gray-700 font-bold mb-2">
              DoubtDesk – Your Personal Doubt-Solving Companion
            </h1>
            <p className="text-gray-600 leading-relaxed mb-2">
              Struggling with a question? DoubtDesk helps students get clear,
              subject-specific answers from expert teachers.
            </p>
          </div>
          <div className="md:w-1/2 h-full">
            <img
              src="stress.png"
              alt="Student thinking"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
      <section id="courses-section" className="mt-16" ref={coursesSectionRef}>
        <h2 className="text-4xl font-bold text-gray-800 mb-10">
          Our Popular Courses
        </h2>
        {loadingCourses ? (
          <p>Loading courses...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {courses.map((course) => (
              <CourseCard
                key={course.courseId}
                topTitle={course.category}
                programTitle={course.title}
                courseName={course.title}
                features={[
                  "All subjects covered",
                  "Ask unlimited questions",
                  "24/7 doubt posting facility",
                ]}
                priceText={`${course.price} BDT`}
                enrollButtonText="Enroll Now"
                onEnrollClick={onEnrollButtonClick}
                isEnrolled={enrolledCourses.has(course.title)}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default HomePage;
