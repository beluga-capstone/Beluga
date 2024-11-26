"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";
import useScroll from "@/hooks/useScroll";
import { useProfile } from "@/hooks/useProfile";
import UserSettingsPopup from "./UserSettingsPopup";
import { cn } from "@/lib/utils";

const TopNavbar = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const [courseDropdownOpen, setCourseDropdownOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrolled = useScroll(5);
  const pathname = usePathname();
  const { profile } = useProfile();
  const router = useRouter();

  // Fetch courses when the component mounts
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetch("http://localhost:5000/courses/search", {
        method: "GET",
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
        console.log("courses", data);
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

  useEffect(() => {
    // Preselect course based on pathname
    const match = pathname.match(/\/assignments\/courses\/(\w+)/);
    if (match && match[1]) {
      setSelectedCourse(match[1]);
    }
  }, [pathname]);

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
      <div className="flex h-[47px] items-center px-4">
        {/* Left-aligned Dropdown */}
        <div className="flex items-center space-x-4">
          {pathname.includes("/assignments/courses/") && (
            <div className="relative">
              <button
                onClick={toggleCourseDropdown}
                className="border border-white rounded p-2 bg-surface flex items-center justify-between text-left"
                style={{
                  minHeight: "40px",
                  alignItems: "center",
                  width: "200px",
                }}
              >
                {selectedCourse
                  ? courses.find((course) => course.id === selectedCourse)
                      ?.name || "Select a Course"
                  : "Select a Course"}
                <Icon
                  icon="mdi:chevron-down"
                  className="ml-2"
                  width="20"
                  height="20"
                />
              </button>
              {courseDropdownOpen && (
                <div
                  className="absolute top-full left-0 bg-surface border border-gray-200 shadow-md z-10"
                  style={{ marginTop: "4px", width: "200px" }}
                >
                  {courses.map((course) => (
                    <button
                      key={course.id}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                      onClick={() => handleCourseSelect(course.id)}
                    >
                      {course.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center-aligned Logo */}
        <div className="flex-grow flex justify-center">
          <Link
            href="/"
            className="md:hidden flex flex-row space-x-3 items-center justify-center"
          >
            <span className="font-bold text-xl">Logo</span>
          </Link>
        </div>

        {/* Right-aligned Profile Button */}
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
