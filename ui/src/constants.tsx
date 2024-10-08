import { Icon } from '@iconify/react';

import { SideNavItem } from './types';

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: <Icon icon="lucide:home" width="24" height="24" />,
    role: ["admin", "professor", "ta", "student"],
  },
  {
    title: 'Students',
    path: '/students',
    icon: <Icon icon="lucide:users" width="24" height="24" />,
    role: ["admin", "professor", "ta"],
  },
  {
    title: 'Assignments',
    path: '/assignments',
    icon: <Icon icon="lucide:folder" width="24" height="24" />,
    role: ["admin", "professor", "ta"],
  },
  { 
    title: 'Machines',
    path: '/machines',
    icon: <Icon icon="lucide:computer" width="24" height="24" />,
    subMenuItems: [
      { title: 'Containers', path: '/machines/containers'},
      { title: 'Images', path: '/machines/images'},
    ],
    role: ["admin", "professor", "ta", "student"],
  },
];