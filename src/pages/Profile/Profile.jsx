import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import "./Profile.css";
import ChannelVideos from "../../components/Channel/ChannelVideos";

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [watchHistory, setWatchHistory] = useState([]);

  const [details, setDetails] = useState({
    fullName: "",
    email: "",
  });

  const navigate = useNavigate();

  // ✅ Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await apiService.user.getCurrentUser();
        setUserData(res.data.data);
        setDetails({
          fullName: res.data.data.fullname || "",
          email: res.data.data.email || "",
        });
        setUser(res.data.data);
      } catch (err) {
        console.error("Failed to fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [setUser]);

  // ✅ Fetch Watch History Details
  useEffect(() => {
    const fetchWatchHistory = async () => {
      try {
        const res = await apiService.user.getWatchHistory(); // assuming this endpoint exists
        setWatchHistory(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch watch history:", err);
      }
    };

    fetchWatchHistory();
  }, []);

  // ✅ Update Account
  const handleAccountUpdate = async () => {
    try {
      setLoading(true);
      await apiService.user.updateAccountDetails(details);
      alert("✅ Account updated successfully!");
      setEditMode(false);

      const res = await apiService.user.getCurrentUser();
      setUserData(res.data.data);
      setUser(res.data.data);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update account details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !userData)
    return <p className="profile-loading">Loading profile...</p>;

  if (!userData) return <p className="profile-loading">No user data found.</p>;

  return (
    <div className="profile-container">
      {/* --- Cover Section --- */}
      <div
        className="profile-cover"
        style={{
          backgroundImage: `url(${userData.coverImage || "/default-cover.jpg"})`,
        }}
      ></div>

      {/* --- Info Section --- */}
      <div className="profile-info">
        <div className="avatar-section">
          <img
            src={userData.avatar || "/default-avatar.png"}
            alt="avatar"
            className="avatar"
          />
        </div>

        <div className="user-details">
          <h2>@{userData.username}</h2>
          <p>Joined: {new Date(userData.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      {/* --- Account Details --- */}
      <div className="update-section">
        <h3>Account Details</h3>
        <input
          type="text"
          placeholder="Full Name"
          value={details.fullName}
          readOnly={!editMode}
          onChange={(e) =>
            setDetails({ ...details, fullName: e.target.value })
          }
        />
        <input
          type="email"
          placeholder="Email"
          value={details.email}
          readOnly={!editMode}
          onChange={(e) => setDetails({ ...details, email: e.target.value })}
        />

        {!editMode ? (
          <button onClick={() => setEditMode(true)}>Update Details</button>
        ) : (
          <button onClick={handleAccountUpdate} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>

      {/* --- Watch History --- */}
      <div className="watch-history">
        <h3>Watch History</h3>
        {watchHistory.length > 0 ? (
          <div className="watch-history-grid">
            {watchHistory.map((video) => (
              <div
                key={video._id}
                className="history-video-card"
                onClick={() => navigate(`/video/${video._id}`)}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="history-video-thumbnail"
                />
                <div className="history-video-info">
                  <h4 className="history-video-title">{video.title}</h4>
                  <p className="history-video-stats">
                    {video.views} views •{" "}
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                  <p className="history-video-owner">
                    {video.owner?.fullname || video.owner?.username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No watch history yet.</p>
        )}
      </div>

      {/* --- Channel Videos Section --- */}
      <ChannelVideos />

      {/* --- Logout --- */}
      <button className="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  );
};

export default ProfilePage;
