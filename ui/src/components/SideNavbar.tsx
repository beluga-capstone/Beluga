'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams, useRouter } from 'next/navigation';
import { SIDENAV_ITEMS } from '@/constants';
import { SideNavItem } from '@/types';
import { Icon } from '@iconify/react';

const SideNavbar = () => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  
  // Keep track of selected courseId in state
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  useEffect(() => {
    // Set selectedCourseId from URL if on a course page
    const courseId = searchParams.get("courseId");
    if (courseId) {
      setSelectedCourseId(courseId);
    } else if (pathname === '/') {
      // Clear selected course when navigating back to dashboard
      setSelectedCourseId(null);
    }
  }, [pathname, searchParams]);

  return (
    <div className="md:w-60 h-screen flex-1 fixed border-r border-foreground hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-foreground h-12 w-full"
          onClick={() => setSelectedCourseId(null)} // Reset courseId when clicking Dashboard
        >
          <span className="h-7 w-7 rounded-lg">
            <img src="../images/beluga.png" alt="The BELUGA logo" className="h-8 w-8" />
          </span>
          <span className="font-bold text-xl hidden md:flex">B E L U G A</span>
        </Link>

        <div className="flex flex-col space-y-2 md:px-6">
          {SIDENAV_ITEMS.map((item, idx) => {
            // Show Students and Assignments if a course is selected, or show other items normally
            if ((item.title === "Students" || item.title === "Assignments") && !selectedCourseId) {
              return null;
            }
            return <MenuItem key={idx} item={item} selectedCourseId={selectedCourseId} />;
          })}
        </div>
      </div>
    </div>
  );
};

export default SideNavbar;

const MenuItem = ({ item, selectedCourseId }: { item: SideNavItem; selectedCourseId: string | null }) => {
  const pathname = usePathname();
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const toggleSubMenu = () => {
    setSubMenuOpen(!subMenuOpen);
  };

  // Conditionally set paths for Students and Assignments links if selectedCourseId is available
  const adjustedPath =
    item.path === '/students' && selectedCourseId
      ? `/students/courses/${selectedCourseId}`
      : item.path === '/assignments' && selectedCourseId
      ? `/assignments/courses/${selectedCourseId}?name=${encodeURIComponent(item.title)}`
      : item.path;

  return (
    <div className="">
      {item.subMenuItems ? (
        <>
          <button
            onClick={toggleSubMenu}
            className={`flex flex-row items-center p-2 rounded-lg w-full justify-between hover:bg-surface ${
              pathname.includes(item.path) ? 'bg-surface' : ''
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
                  className={`${subItem.path === pathname ? 'font-bold' : ''}`}
                >
                  <span>{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <Link
          href={adjustedPath}
          className={`flex flex-row space-x-4 items-center p-2 rounded-lg hover:bg-surface ${
            adjustedPath === pathname ? 'bg-surface' : ''
          }`}
        >
          {item.icon}
          <span className="font-semibold text-xl flex">{item.title}</span>
        </Link>
      )}
    </div>
  );
};
