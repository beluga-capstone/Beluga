"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import useScroll from "@/hooks/useScroll";
import { useProfile } from "@/hooks/useProfile";
import UserSettingsPopup from "./UserSettingsPopup";
import { cn } from "@/lib/utils";

const TopNavbar = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrolled = useScroll(5);
  const { profile } = useProfile();

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
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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
