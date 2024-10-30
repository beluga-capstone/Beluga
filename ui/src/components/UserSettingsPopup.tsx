import Link from "next/link";

interface UserSettingsPopupProps {
  setMenuIsOpen: (value: boolean) => void;
}

export default function UserSettingsPopup({
  setMenuIsOpen,
}: UserSettingsPopupProps) {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-background shadow-lg rounded-md z-50">
      <ul className="py-2 text-sm">
        <li>
          <Link
            href="/profile"
            onClick={() => setMenuIsOpen(false)}
            className="block px-4 py-2 hover:bg-surface"
          >
            Profile
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            onClick={() => setMenuIsOpen(false)}
            className="block px-4 py-2 hover:bg-surface"
          >
            Settings
          </Link>
        </li>
        <li>
          <Link
            href="/logout"
            onClick={() => setMenuIsOpen(false)}
            className="block px-4 py-2 hover:bg-surface"
          >
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
