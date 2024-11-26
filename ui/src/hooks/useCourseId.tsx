'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';

export const useCourseId = () => {
  const params = useParams();
  const [courseId, setCourseId] = useState<string | null>(null);

  useEffect(() => {
    if (Array.isArray(params.courseId)) {
      setCourseId(params.courseId[0] || null); // Handle array case
    } else {
      setCourseId(params.courseId || null); // Handle string case
    }
  }, [params.courseId]);

  return { courseId, setCourseId };
};

