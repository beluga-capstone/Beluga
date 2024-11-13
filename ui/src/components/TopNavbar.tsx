"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import useScroll from "@/hooks/useScroll";
import { cn } from "@/lib/utils";
import UserSettingsPopup from "./UserSettingsPopup";
import { useDashboard } from "@/hooks/useDashboard";

const TopNavbar = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrolled = useScroll(5);
  const { courses } = useDashboard();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const courseId = parseInt(searchParams.get("courseId") || "0", 10);
  const currentCourse = courses.find(course => course.id === courseId);
  const isCoursePage = pathname.includes("/assignments/courses/") && courseId > 0;

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const toggleCourseDropdown = () => {
    setCourseDropdownOpen(!courseDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuIsOpen(false);
      setCourseDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCourseSelect = (selectedCourseId: number, courseName: string) => {
    router.push(`/assignments/courses/${selectedCourseId}?courseId=${selectedCourseId}&name=${encodeURIComponent(courseName)}`);
    setCourseDropdownOpen(false);
  };

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-foreground`,
        {
          "backdrop-blur-lg": scrolled,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex flex-row space-x-3 items-center justify-center md:hidden">
            <span className="h-7 w-7 rounded-lg" />
            <span className="font-bold text-xl flex ">Logo</span>
          </Link>
          {isCoursePage && (
            <div className="relative">
              <button
                onClick={toggleCourseDropdown}
                className="border border-white rounded p-1 bg-surface flex items-center"
              >
                {currentCourse ? currentCourse.name : ""}
                <Icon icon="mdi:chevron-down" className="ml-2" width="20" height="20" />
              </button>
              {courseDropdownOpen && (
                <div
                  className="absolute top-10 left-0 w-full border border-white rounded bg-surface shadow-lg z-10"
                  ref={menuRef}
                  style={{
                    boxShadow: "0px 4px 10px rgba(255, 255, 255, 0.2)", 
                  }}
                >
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      className="block w-full px-4 py-2 text-left text-white-700 hover:bg-gray-500"
                      onClick={() => handleCourseSelect(course.id, course.name)}
                    >
                      {course.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:flex space-x-4 relative">
          <div className="relative" ref={menuRef}>
            <button onClick={toggleMenu} title="Profile Button">
              <Icon icon="lucide:user" width="24" height="24" />
            </button>
            {menuIsOpen && <UserSettingsPopup setMenuIsOpen={setMenuIsOpen} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
