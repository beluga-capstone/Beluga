import Link from "next/link";

interface UserSettingsPopupProps {
  setMenuIsOpen: (value: boolean) => void;
}

export default function UserSettingsPopup({
  setMenuIsOpen,
}: UserSettingsPopupProps) {
  const handleLogout = async () => {
    try {
      const response = await fetch(`${process.env.backend}/auth/logout`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        // Redirect to login or home after logout
        window.location.href = '/';
      } else {
        console.error('Failed to log out', response.statusText);
      }
    } catch (error) {
      console.error('Error during logout', error);
    }
  };

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
          <button
            onClick={() => {
              setMenuIsOpen(false);
              handleLogout();
            }}
            className="block w-full text-left px-4 py-2 hover:bg-surface"
          >
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
}
