'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import { SideNavItem } from '@/types';
import { useDashboard } from '@/hooks/useDashboard';
import { useCourseId } from '@/hooks/useCourseId';

const SideNavbar = () => {
  const pathname = usePathname();
  const { fetchCourses, getCourse } = useDashboard();
  const { courseId, setCourseId } = useCourseId();
  const [courseName, setCourseName] = useState<string | null>(null);

  useEffect(() => {
    const getCourses = async () => {
      await fetchCourses();
    };

    const intervalId = setInterval(() => {
      getCourses();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!courseId) return;

    const fetchCourseName = async () => {
      console.log("courseuid",courseId);
      const response = await getCourse(courseId);
      if (response) {
        setCourseId(courseId);
        setCourseName(response.name);
      }
    };

    fetchCourseName();
  }, [courseId]);

  const getSideNavItems = (): SideNavItem[] => {
    const defaultItems: SideNavItem[] = [
      {
        title: 'Home',
        path: `/`,
        icon: <Icon icon="lucide:home" width="24" height="24" />,
      },
      ...(courseId
        ? [
            {
              title: `${courseName}`,
              path: '/',
              icon: <Icon icon="lucide:notebook-pen" width="24" height="24" />,
              dynamic: true,
              subMenuItems: [
                { title: 'Students', path: `/students/courses/${courseId}` },
                { title: 'Assignments', path: `/assignments/courses/${courseId}` },
              ],
            },
          ]
        : []),
    ];

    const machinesItem: SideNavItem = {
      title: 'Machines',
      path: '/machines',
      icon: <Icon icon="lucide:monitor" width="24" height="24" />,
      subMenuItems: [
        { title: 'Containers', path: '/machines/containers' },
        { title: 'Images', path: '/machines/images' },
      ],
    };

    return [...defaultItems, machinesItem];
  };

  const sideNavItems = getSideNavItems();

  return (
    <div className="md:w-60 h-screen flex-1 fixed border-r border-foreground hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-foreground h-12 w-full"
        >
          <span className="h-7 w-7 rounded-lg">
            <img src="/images/beluga.png" alt="The BELUGA logo" className="h-8 w-8" />
          </span>
          <span className="font-bold text-xl hidden md:flex">B E L U G A</span>
        </Link>

        <div className="flex flex-col space-y-2 md:px-6">
          {sideNavItems.map((item, idx) => (
            <MenuItem key={idx} item={item} pathname={pathname} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;

const MenuItem = ({ item, pathname }: { item: SideNavItem; pathname: string }) => {
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  const isActive = pathname.startsWith(item.path);

  return (
    <div>
      {item.subMenuItems ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg w-full justify-between hover:bg-surface ${
              isActive ? 'bg-surface' : ''
            }`}
          >
            <div className="flex flex-row space-x-4 items-center">
              {item.icon}
              <span className="font-semibold text-xl flex">{item.title}</span>
            </div>
            <div className={`${subMenuOpen ? 'rotate-180' : ''} flex`}>
              <Icon icon="lucide:chevron-down" width="24" height="24" />
            </div>
          </button>

          {subMenuOpen && (
            <div className="my-2 ml-12 flex flex-col space-y-4">
              {item.subMenuItems?.map((subItem, idx) => (
                <Link
                  key={idx}
                  href={subItem.path}
                  className={`${pathname === subItem.path ? 'font-bold' : ''}`}
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={item.path}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-surface ${
            pathname === item.path ? 'bg-surface' : ''
          }`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};

