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
    releaseDate: new Date(),
    dueDate: new Date(),
    containerId: 1,
  },
  {
    id: 2,
    courseId: 1,
    title: "Assignment 2",
    description: "This is the second assignment",
    releaseDate: new Date(),
    dueDate: new Date(),
    containerId: 2,
  },
  {
    id: 3,
    courseId: 1,
    title: "Assignment 3",
    description: "This is the third assignment",
    releaseDate: new Date(),
    dueDate: new Date(),
    containerId: 3,
  }
];

export const DEFAULT_CONTAINERS: Container[] = [];
