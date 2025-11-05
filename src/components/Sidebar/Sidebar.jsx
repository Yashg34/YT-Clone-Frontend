import "./Sidebar.css";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={toggleSidebar}>
        ✕
      </button>

      <div className="sidebar-links">
        <Link to="/" onClick={toggleSidebar} className="sidebar-link">
          🏠 Home
        </Link>
        <Link to="/profile" onClick={toggleSidebar} className="sidebar-link">
          👤 Profile
        </Link>
        <Link to="/upload" onClick={toggleSidebar} className="sidebar-link">
          ⬆️ Video Upload
        </Link>
        <Link to="/playlist" onClick={toggleSidebar} className="sidebar-link">
          🎵 Playlists
        </Link>
        <Link to="/tweet" onClick={toggleSidebar} className="sidebar-link">
          🐦 Tweets
        </Link>
        {/* <Link to="/subscriptions" onClick={toggleSidebar} className="sidebar-link">
          📺 Subscriptions
        </Link> */}
      </div>
    </div>
  );
};

export default Sidebar;
