export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export interface Profile {
  firstName: string;
  lastName: string;
  middleName?: string;
  username:string;
  email: string;
  role_id: number;
  user_id:string;
  created_at:string;
  updated_at:string;
}

export interface Course {
  id: number;
  name: string;
  section: number;
  term: string;
  studentsEnrolled: number;
  isPublished: boolean;
  professor: string;
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
}

export interface Assignment {
  assignment_id: string;
  course_id: string;
  title: string;
  description: string;
  due_at: Date | null;
  lock_at: Date | null;
  unlock_at: Date | null;
  publish_at?: Date | null;
  is_unlocked?: boolean;
  is_published?: boolean;
  allows_late_submissions: boolean;
  docker_image_id?: string | null;
  user_id?: string;
}

export interface Container {
  id: number;
  name: string;
  status: "running" | "paused" | "stopped";
  launchTime: string;
  image: Image;
  cpuCores: number;
  memoryGBs: number;
  storageGBs: number;
}

export interface Image {
  docker_image_id: string;
  user_id: string;
  description: string;
}

export interface User {
  user_id: string;
  first_name: string;
  last_name: string;
  middleName?: string;
  email: string;
  role_id: string;
  courseId?: number;
}
