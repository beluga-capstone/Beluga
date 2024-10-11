import { Icon } from '@iconify/react';

import { SideNavItem, Container, Course } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
  },
  {
    title: 'Students',
    path: '/students',
    icon: <Icon icon="lucide:users" width="24" height="24" />,
  },
  {
    title: 'Assignments',
    path: '/assignments',
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
  },
  { 
    title: 'Machines',
    path: '/machines',
    icon: <Icon icon="lucide:computer" width="24" height="24" />,
    subMenuItems: [
      { title: 'Containers', path: '/machines/containers' },
      { title: 'Images', path: '/machines/images' },
    ],
  },
];

export const DEFAULT_CONTAINERS: Container[] = [
];

export const DEFAULT_COURSES: Course[] = [
  { id: 1, name: "course1", term:"spring", year:2024 },
  { id: 2, name: "course2", term:"spring", year:2023 },
  { id: 3, name: "course3", term:"fall", year:2022 },
  { id: 4, name: "course2", term:"spring", year:2023 },
  { id: 5, name: "course2", term:"spring", year:2023 },
  { id: 6, name: "course2", term:"spring", year:2023 },
  { id: 7, name: "course2", term:"spring", year:2023 },
  { id: 8, name: "course2", term:"spring", year:2023 },
];