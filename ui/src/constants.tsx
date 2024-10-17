import { Icon } from "@iconify/react";

import { SideNavItem, Container, Assignment } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: "Students",
    path: "/students",
    icon: <Icon icon="lucide:users" width="24" height="24" />,
  },
  {
    title: "Assignments",
    path: "/assignments",
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
  },
  {
    title: "Machines",
    path: "/machines",
    icon: <Icon icon="lucide:computer" width="24" height="24" />,
    subMenuItems: [
      { title: "Containers", path: "/machines/containers" },
      { title: "Images", path: "/machines/images" },
    ],
  },
];

export const ASSIGNMENTS: Assignment[] = [
  {
    id: 1,
    courseId: 1,
    title: "Assignment 1",
    description: "This is the first assignment",
    dueDate: "2021-09-30",
    containerId: 1,
  },
  {
    id: 2,
    courseId: 1,
    title: "Assignment 2",
    description: "This is the second assignment",
    dueDate: "2021-10-30",
    containerId: 2,
  },
  {
    id: 3,
    courseId: 1,
    title: "Assignment 3",
    description: "This is the third assignment",
    dueDate: "2021-11-30",
    containerId: 3,
  }
];

export const DEFAULT_CONTAINERS: Container[] = [];
