import { Cog6ToothIcon, UserIcon } from "@heroicons/react/24/solid";

export default function TopNavbar() {
  return (
    <nav className="flex flex-row-reverse p-4">
      <div className="px-1">
        <Cog6ToothIcon className="size-6" />
      </div>
      <div className="px-1">
        <UserIcon className="size-6" />
      </div>
    </nav>
  );
}
