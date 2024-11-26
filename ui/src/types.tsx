export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
  dynamic?: boolean;
};

export interface Profile {
  firstName: string;
  lastName: string;
  middleName?: string;
  username: string;
  email: string;
  role_id: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  private_key: string;
}

export interface Course {
  course_id: string;
  name: string;
  term?: string; 
  term_id?: string;
  user_id?: string;
  studentsEnrolled: number;
  isPublished: boolean;
  professor?: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role?: string; 
  courseId?: string;
}

export interface Assignment {
  assignment_id: string;
  course_id: string;
  title: string;
  description: string;
  due_at?: Date | null;
  lock_at?: Date | null;
  unlock_at?: Date | null;
  publish_at?: Date | null;
  is_unlocked?: boolean;
  is_published?: boolean;
  allows_late_submissions: boolean;
  docker_image_id?: string | null;
  user_id?: string;
}

export interface Submission {
  submission_id: string;
  user_id: string;
  assignment_id: string;
  submitted_at: Date;
  grade: number;
  status: string;
  data: File;
}

export interface Container {
  docker_container_id: string;
  docker_container_name: string;
  user_id: string;
  description: string;
}

export interface Image {
  docker_image_id: string;
  user_id: string;
  description: string;
  packages: string;
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: string;
  courseId?: number;
}
