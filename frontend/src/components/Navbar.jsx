import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="brand">
        <span className="brand-icon">✦</span>
        SocialSphere
      </Link>

      <div className="nav-links">

        <Link to="/" className="nav-link">
          Home
        </Link>

        {isLoggedIn && (
          <>
            <Link to="/chat" className="nav-link">
              Messages
            </Link>

            <Link to="/notifications" className="nav-link">
              Notifications
            </Link>

            <Link to="/profile" className="nav-link">
              Profile
            </Link>
          </>
        )}

      </div>

      <div className="nav-right">

        {isLoggedIn ? (
          <>
            <div
              className="user-mini"
              onClick={() => navigate("/profile")}
            >
              <div className="avatar">
                {user?.username?.charAt(0)?.toUpperCase()}
              </div>

              <span>{user?.username}</span>
            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="login-nav">
              Login
            </Link>

            <Link to="/register" className="register-nav">
              Register
            </Link>
          </>
        )}

      </div>

    </nav>
  );
}

export default Navbar;