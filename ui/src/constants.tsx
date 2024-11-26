import { Home, Users, Folder, Monitor } from "lucide-react";
import {
  SideNavItem,
  Container,
  Image,
  Student,
  Course,
  Assignment,
} from "./types";

export const ROLES = {
  ADMIN: 2,
  PROFESSOR: 1,
  TA: 4,
  STUDENT: 8,
};

export const ROLE_NAMES = {
  [ROLES.ADMIN]: "Admin",
  [ROLES.PROFESSOR]: "Professor",
  [ROLES.TA]: "TA",
  [ROLES.STUDENT]: "Student",
};

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: <Home size={24} />,
  },
  {
    title: "Students",
    path: "/students/courses/[courseId]",
    icon: <Users size={24} />,
    dynamic: true,
  },
  {
    title: "Assignments",
    path: "assignments/courses/[courseId]",
    icon: <Folder size={24} />,
    dynamic: true,
  },
  {
    title: "Machines",
    path: "/machines",
    icon: <Monitor size={24} />,
    subMenuItems: [
      { title: "Containers", path: "/machines/containers" },
      { title: "Images", path: "/machines/images" },
    ],
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
