import { Cog6ToothIcon, UserIcon } from "@heroicons/react/24/solid";

export default function TopNavbar() {
  return (
    <nav className="flex justify-between p-4">
      <div className="px-1">
        <img src="images/beluga.png" alt="Description" className="h-8 w-8" />
      </div>
      <div className="flex">
        <div className="px-1">
          <Cog6ToothIcon className="h-8 w-8" />
        </div>
        <div className="px-1">
          <UserIcon className="h-8 w-8" />
        </div>
      </div>
    </nav>
  );
}
