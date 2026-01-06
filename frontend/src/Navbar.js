import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const username = localStorage.getItem("username");
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("username");
      localStorage.removeItem("userId");
      navigate("/");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <span className="navbar-icon">🎭</span>
          <span className="navbar-title">Emotion AI</span>
        </div>
        
        <div className="navbar-links">
          <Link 
            to="/home" 
            className={`nav-link ${isActive('/home') ? 'nav-link-active' : ''}`}
          >
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link 
            to="/reports" 
            className={`nav-link ${isActive('/reports') ? 'nav-link-active' : ''}`}
          >
            <span className="nav-icon">📊</span>
            <span>Reports</span>
          </Link>
        </div>

        <div className="navbar-user">
          <div 
            className="profile-dropdown"
            onMouseEnter={() => setShowProfileMenu(true)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <div className="profile-trigger">
              <div className="profile-avatar">
                {username ? username.charAt(0).toUpperCase() : "U"}
              </div>
              <span className="profile-username">{username}</span>
              <span className="profile-arrow">▼</span>
            </div>

            {showProfileMenu && (
              <div className="profile-menu">
                <div className="profile-menu-header">
                  <div className="profile-menu-avatar">
                    {username ? username.charAt(0).toUpperCase() : "U"}
                  </div>
                  <div className="profile-menu-info">
                    <div className="profile-menu-name">{username}</div>
                    <div className="profile-menu-email">User Account</div>
                  </div>
                </div>
                <button className="profile-menu-item logout-item" onClick={handleLogout}>
                  <span className="menu-item-icon">🚪</span>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
