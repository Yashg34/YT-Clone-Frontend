import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./Navbar.css";
import Sidebar from "../Sidebar/Sidebar.jsx";

const Navbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Search:", searchQuery);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <button className="menu-btn" onClick={toggleSidebar} aria-label="Toggle menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
            </svg>
          </button>
          <h1 className="navbar-title" onClick={() => navigate("/")} role="button">
            <svg width="32" height="32" viewBox="0 0 90 20" fill="#ff0000">
              <path d="M27.9727 3.12324C27.6435 1.89323 26.6768 0.926623 25.4468 0.597366C23.2197 2.24288e-07 14.285 0 14.285 0C14.285 0 5.35042 2.24288e-07 3.12323 0.597366C1.89323 0.926623 0.926623 1.89323 0.597366 3.12324C2.24288e-07 5.35042 0 10 0 10C0 10 2.24288e-07 14.6496 0.597366 16.8768C0.926623 18.1068 1.89323 19.0734 3.12323 19.4026C5.35042 20 14.285 20 14.285 20C14.285 20 23.2197 20 25.4468 19.4026C26.6768 19.0734 27.6435 18.1068 27.9727 16.8768C28.5701 14.6496 28.5701 10 28.5701 10C28.5701 10 28.5677 5.35042 27.9727 3.12324Z" />
              <path d="M11.4253 14.2854L18.8477 10.0004L11.4253 5.71533V14.2854Z" fill="white"/>
            </svg>
            <span>YouTube</span>
          </h1>
        </div>

        <form className="navbar-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
            </svg>
          </button>
        </form>

        <div className="navbar-right">
          {isAuthenticated && user ? (
            <div className="user-menu" onClick={() => navigate("/profile")} role="button">
              <img src={user.avatar} alt={user.username} className="user-avatar" />
              <span className="user-name">{user.username}</span>
            </div>
          ) : (
            <button className="login-btn" onClick={() => navigate("/login")}>
              Sign In
            </button>
          )}
        </div>
      </nav>

      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
    </>
  );
};

export default Navbar;
