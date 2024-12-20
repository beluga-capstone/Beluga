"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import { Icon } from "@iconify/react";
import useScroll from "@/hooks/useScroll";
import { useProfile } from "@/hooks/useProfile";
import UserSettingsPopup from "./UserSettingsPopup";
import { cn } from "@/lib/utils";

const TopNavbar = () => {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();
  const { profile } = useProfile();

  const toggleMenu = () => {
    setMenuIsOpen(!menuIsOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setMenuIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-foreground`,
        {
          "backdrop-blur-lg": scrolled,
          "": selectedLayout,
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
            <span className="font-bold text-xl flex ">Logo</span>
          </Link>
        </div>

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
