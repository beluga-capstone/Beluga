'use client';

import React from 'react';
import Link from 'next/link';
import { SIDENAV_ITEMS } from '@/constants';
import SideNavbarItem from './SideNavbarItem';

export default function SideNavbar({ role }: { role: string }) {
  return (
    <div className="md:w-60 bg-white h-screen flex-1 fixed border-r border-zinc-200 hidden md:flex">
      <div className="flex flex-col space-y-6 w-full">
        <Link
          href="/"
          className="flex flex-row space-x-3 items-center justify-center md:justify-start md:px-6 border-b border-zinc-200 h-12 w-full"
        >
          <span className="h-7 w-7 bg-white-300 rounded-lg">
            <img src="images/beluga.png" alt="The BELUGA logo" className="h-8 w-8" />
          </span>
          <span className="font-bold text-xl hidden md:flex">B E L U G A </span>
        </Link>

        <div className="flex flex-col space-y-2  md:px-6">
          {SIDENAV_ITEMS.filter(item => item.role?.includes(role)).map((item, idx) => (
            <SideNavbarItem key={idx} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
