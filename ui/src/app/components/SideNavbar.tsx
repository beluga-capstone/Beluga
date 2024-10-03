export default function SideNavbar() {
  return (
    <nav className="p-4">
      <ul>
        <li>
          <a href="/">Dashboard</a>
        </li>
        <li>
          <a href="/students">Students</a>
        </li>
        <li>
          <a href="/assignments">Assignments</a>
        </li>
        <li>
          <a href="/containers">Containers</a>
        </li>
        <li>
          <a href="/images">Images</a>
        </li>
      </ul>
    </nav>
  );
}
