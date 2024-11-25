"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSelectedLayoutSegment } from "next/navigation";
import { Icon } from "@iconify/react";
import useScroll from "@/hooks/useScroll";
import { useProfile } from "@/hooks/useProfile";
import UserSettingsPopup from "./UserSettingsPopup";
import { cn } from "@/lib/utils";

const TopNavbar = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]); // State to store courses
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null); // Track selected course
  const menuRef = useRef<HTMLDivElement>(null);
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const { profile } = useProfile();
  const router = useRouter();

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch("http://localhost:5000/courses");
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        console.log("courses", data)
      } else {
        console.error("Failed to fetch courses");
      }
    };
    fetchCourses();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuIsOpen(false);
        setCourseDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleCourseDropdown = () => {
    setCourseDropdownOpen(!courseDropdownOpen);
  };

  const handleCourseSelect = (selectedCourseId: string) => {
    setSelectedCourse(selectedCourseId);
    router.push(`/assignments/courses/${selectedCourseId}`);
    setCourseDropdownOpen(false);
  };

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
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
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-7 w-7 rounded-lg" />
            <span className="font-bold text-xl flex">Logo</span>
          </Link>
        </div>

        <div className="">
          <p>{selectedCourse}</p>
              <button
                onClick={toggleCourseDropdown}
                className="border border-white rounded p-1 bg-surface"
              >
                {selectedCourse ? selectedCourse : ""}
                <Icon icon="mdi:chevron-down" className="ml-2" width="20" height="20" />
              </button>
              {courseDropdownOpen && (
                <div
                  className="absolute top-10 left-0 bg-surface"
                >
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      className="block w-full px-4 py-2 text-left hover:bg-on-surface"
                      onClick={() => handleCourseSelect(course.course_id)}
                    >
                      {course.name}
                    </button>
                  ))}
                </div>
          )}
        </div>

        {/* Profile button */}
        <div className="hidden md:flex space-x-2 items-center relative">
          <button onClick={toggleMenu} title="Profile Button" className="flex items-center space-x-2">
            <Icon icon="lucide:user" width="24" height="24" />
            <span>
              {profile?.firstName} {profile?.lastName}
            </span>
          </button>
          <div className="relative" ref={menuRef}>
            {menuIsOpen && <UserSettingsPopup setMenuIsOpen={setMenuIsOpen} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
