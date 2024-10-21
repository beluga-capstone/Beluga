import { Icon } from "@iconify/react";

import { SideNavItem, Container, Assignment, Student } from "./types";

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

export const DEFAULT_STUDENTS: Student[] = [
  {
    id: 1,
    firstName: "Bode",
    lastName: "Raymond",
    email: "boderaymond@tamu.edu",
  },
  {
    id: 2,
    firstName: "Deric",
    lastName: "Le",
    email: "rake@tamu.edu",
  },
  {
    id: 3,
    firstName: "Drew",
    lastName: "Pusey",
    email: "drewpusey@tamu.edu",
  },
  {
    id: 4,
    firstName: "Jeffrey",
    lastName: "Li",
    email: "cherrytree1324@tamu.edu",
  },
  {
    id: 5,
    firstName: "Minh",
    lastName: "Nguyen",
    middleName: "Dao",
    email: "minhdao@tamu.edu",
  },
  {
    id: 6,
    firstName: "Nitesh",
    lastName: "Duraivel",
    email: "niteshduraivel@tamu.edu",
  },
];

export const DEFAULT_CONTAINERS: Container[] = [];

export const DEFAULT_FILES: string[] = [
  `# This is a sample Python code to show how it looks in BELUGA

print("a + b = c")
print("Enter a: ")
a = int(input())
print("Enter b: ")
b = int(input())
c = a + b
print("%d + %d = %d" % (a, b, c))
`,
];
