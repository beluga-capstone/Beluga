"use client";

import { useUsers } from "@/hooks/useUsers";
import { useDashboard } from "@/hooks/useDashboard";
import StudentsTable from "../../StudentsTable";

const CourseStudentsPage = ({ params }: { params: { courseId: string } }) => {
  const courseId = parseInt(params.courseId, 10);
  const { courses } = useDashboard();
  const { users } = useUsers();

  const course = courses.find((course) => course.id === courseId);
  const courseName = course ? course.name : "Course";

  const courseStudents = users.filter((user) => user.courseId === courseId);

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-3xl mb-6">Students Enrolled in {courseName}</h1>
      <StudentsTable students={courseStudents} />
    </div>
  );
};

export default CourseStudentsPage;
