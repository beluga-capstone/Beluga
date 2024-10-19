export type SideNavItem = {
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

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
}
