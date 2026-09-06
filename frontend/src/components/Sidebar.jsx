import { NavLink } from "react-router-dom";

function Sidebar() {

  return (
    <aside className="sidebar">

      <NavLink to="/" className="side-link">
        🏠
        <span>Home</span>
      </NavLink>

      <NavLink to="/profile" className="side-link">
        👤
        <span>Profile</span>
      </NavLink>

      <NavLink to="/create-post" className="side-link">
        ➕
        <span>Create Post</span>
      </NavLink>

      <NavLink to="/chat" className="side-link">
        💬
        <span>Messages</span>
      </NavLink>

      <NavLink to="/notifications" className="side-link">
        🔔
        <span>Notifications</span>
      </NavLink>

      <NavLink to="/media" className="side-link">
        🖼️
        <span>Media</span>
      </NavLink>

      <NavLink to="/settings" className="side-link">
        ⚙️
        <span>Settings</span>
      </NavLink>

    </aside>
  );
}

export default Sidebar;