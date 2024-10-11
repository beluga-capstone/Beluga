"use client";

import React from 'react';
import { Plus } from 'lucide-react';
import DashboardList from '@/components/DashboardList';
import CourseItem from '@/components/CourseItem';
import BulkActions from '@/components/DashboardBulkActions';
import Button from '@/components/Button';
import { useCourses } from '@/hooks/useCourses';

const Dashboard: React.FC = () => {
  const {
    courses,
    selectedCourses,
    addCourse,
    deleteCourse,
    toggleSelectCourse,
    performBulkAction,
  } = useCourses();

  return (
    <div className="container mx-auto p-4">
      <h1 className="font-bold text-4xl mb-6">Dashboard</h1>
      <div className="mb-4 flex justify-between items-center">
        <Button
          onClick={() => addCourse("lol", "spring", 999)}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center"
        >
          <Plus className="mr-2" /> Add Course
        </Button>

        <BulkActions
          selectedCount={selectedCourses.length}
          onDelete={() => performBulkAction('delete')}
        />
      </div>

      <DashboardList 
        courses={courses}
        onDelete={deleteCourse}
        onToggleSelect={toggleSelectCourse}
        selectedCourses={selectedCourses}
      />
    </div>
  );
};

export default Dashboard;
