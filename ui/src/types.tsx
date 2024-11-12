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
  id: number;
  courseId: number;
  title: string;
  description: string;
  isPublished: boolean;
  releaseDate: Date;
  dueDate: Date;
  allowsLateSubmissions: boolean;
  containerId: number;
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
  docker_image_id: number;
  user_id: number;
  description: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
  role: string;
  courseId?: number;
}