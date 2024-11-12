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
}

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
}

export interface Assignment {
  assignmentId: number;
  courseId: string;
  title: string;
  description: string;
  dueAt: Date;
  lockAt: Date;
  unlockAt: Date;
  isUnlocked: boolean;
  isPublished: boolean;
  publishAt: Date;
  allowsLateSubmissions: boolean;
  imageId: number;
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
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: string;
}
