import { Icon } from '@iconify/react';

import { SideNavItem, Container, Image } from './types';

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

export const DEFAULT_IMAGES: Image[] = [
  {
    id: 1,
    name: "Ubuntu 24.10"
  },
  {
    id: 2,
    name: "CentOS 7.0-1406"
  }
];
