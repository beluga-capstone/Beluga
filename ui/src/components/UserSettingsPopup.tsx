import Link from 'next/link';

export default function UserSettingsPopup() {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-background shadow-lg rounded-md z-50">
      <ul className="py-2 text-sm">
        <li>
          <Link href="/profile" className="block px-4 py-2 hover:bg-surface">
            Profile
          </Link>
        </li>
        <li>
          <Link href="/settings" className="block px-4 py-2 hover:bg-surface">
            Settings
          </Link>
        </li>
        <li>
          <Link href="/logout" className="block px-4 py-2 hover:bg-surface">
            Logout
          </Link>
        </li>
      </ul>
    </div>
  );
}
