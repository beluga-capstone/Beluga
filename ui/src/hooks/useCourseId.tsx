'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export const useCourseId = () => {
  const params = useParams();
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (Array.isArray(params.courseId)) {
      setCourseId(params.courseId[0] || null); // Handle array case
    } else if (params.courseId) {
      setCourseId(params.courseId); // Handle string case
    } else {
    }
  }, [params.courseId]);

  return { courseId, setCourseId };
};

