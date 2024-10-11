import { Home, Users, Folder, Monitor } from 'lucide-react'; // Import lucide-react icons

import { SideNavItem, Container, User } from './types';

export const ROLES = [
  "Admin", "Professor", "TA", "Student"
];

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Home size={24} />, // Use lucide-react icons directly
  },
  {
    title: 'Students',
    path: '/students',
    icon: <Users size={24} />,
  },
  {
    title: 'Assignments',
    path: '/assignments',
    icon: <Folder size={24} />,
  },
  { 
    title: 'Machines',
    path: '/machines',
    icon: <Monitor size={24} />, // Use Monitor for machines
    subMenuItems: [
      { title: 'Containers', path: '/machines/containers' },
      { title: 'Images', path: '/machines/images' },
    ],
  },
];

export const DEFAULT_CONTAINERS: Container[] = [
];

export const DEFAULT_USERS: User[] = [
  { id: 1, firstName: 'Deric', lastName: 'Le', role: 'Admin' },
  { id: 2, firstName: 'Drew', lastName: 'Pusey', role: 'Student' },
  { id: 3, firstName: 'Minh', lastName: 'Nguyen', middleName:"Dao", role: 'Student' },
];