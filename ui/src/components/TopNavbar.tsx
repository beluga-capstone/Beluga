'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';
import { Icon } from '@iconify/react';
import useScroll from '@/hooks/use-scroll';
import { cn } from '@/lib/utils';

import UserSettingsPopup from './UserSettingsPopup';

const TopNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Popup state
  const scrolled = useScroll(5);
  const selectedLayout = useSelectedLayoutSegment();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div
      className={cn(
        `sticky inset-x-0 top-0 z-30 w-full transition-all border-b border-gray-200`,
        {
          'border-b border-gray-200 bg-white/75 backdrop-blur-lg': scrolled,
          'border-b border-gray-200 bg-white': selectedLayout,
        }
      )}
    >
      <div className="flex h-[47px] items-center justify-between px-4">
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="flex flex-row space-x-3 items-center justify-center md:hidden"
          >
            <span className="h-7 w-7 bg-zinc-300 rounded-lg" />
            <span className="font-bold text-xl flex ">Logo</span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-4 relative">
          {/* <div>
            <Icon icon="lucide:settings" width="24" height="24" />
          </div> */}

          <div className="relative">
            <button onClick={toggleMenu}>
              <Icon icon="lucide:user" width="24" height="24" />
            </button>
            {isMenuOpen && (<UserSettingsPopup />)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
