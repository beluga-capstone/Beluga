"use client";

import { useState } from 'react';
import { Course } from '@/types';
import { DEFAULT_COURSES } from '@/constants';
import { useRouter } from 'next/navigation';

export const useCourses = () => {
    const router = useRouter();

    const [courses, setCourses] = useState<Course[]>(DEFAULT_COURSES);
    const [selectedCourses, setSelectedCourses] = useState<number[]>([]);

    const addCourse = (name: string, term: string, year: number) => {
        const newCourse: Course = {
            id: Date.now(),
            name: name,
            term: term,
            year: year
        };
        const updatedCourses = [...courses, newCourse];
        setCourses(updatedCourses);
    };

    const deleteCourse = (id: number) => {
        const updatedCourses = courses.filter(course => course.id !== id);
        router.refresh();
        setCourses(updatedCourses);
        setSelectedCourses(selectedCourses.filter(selectedId => selectedId !== id));
    };

    const toggleSelectCourse = (id: number) => {
        setSelectedCourses(prevSelected =>
            prevSelected.includes(id)
                ? prevSelected.filter(selectedId => selectedId !== id)
                : [...prevSelected, id]
        );
    };

    const performBulkAction = (action: 'delete') => {
        if (action === 'delete') {
            const updatedCourses = courses.filter(course => !selectedCourses.includes(course.id));
            setCourses(updatedCourses);
            setSelectedCourses([]);
            return null;
        }
        return null;
    };

    return {
        courses,
        selectedCourses,
        addCourse,
        deleteCourse,
        toggleSelectCourse,
        performBulkAction,
    };
};