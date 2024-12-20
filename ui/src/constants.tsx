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
  ADMIN: 1,
  PROFESSOR: 2,
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
    path: "/students",
    icon: <Users size={24} />,
  },
  {
    title: "Assignments",
    path: "/assignments",
    icon: <Folder size={24} />,
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

export const DEFAULT_COURSES: Course[] = [
  {
    id: 1,
    name: "CSCE 120",
    section: 500,
    term: "Fall 2024",
    studentsEnrolled: 50,
    isPublished: true,
  },
  {
    id: 2,
    name: "CSCE 313",
    section: 200,
    term: "Fall 2024",
    studentsEnrolled: 67,
    isPublished: true,
  },
  {
    id: 3,
    name: "CSCE 410",
    section: 500,
    term: "Spring 2024",
    studentsEnrolled: 0,
    isPublished: false,
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
