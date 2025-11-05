import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// --- Public Pages ---
import Login from "../pages/Login/Login.jsx";
import Register from "../pages/Register/Register.jsx";

// --- Protected Pages ---
import Home from "../pages/Home/Home.jsx"; 
import VideoPlay from "../pages/VideoPlay/VideoPlay.jsx"; // Component for /video/:videoId
import Channel from "../pages/Channel/Channel.jsx"; // Component for /c/:username
import ProfilePage from "../pages/Profile/Profile.jsx";
import PlaylistPage from "../pages/Playlist/Playlist.jsx";
import TweetPage from "../pages/Tweet/Tweet.jsx";
import UploadVideo from "../components/VideoUpload/VideoUpload.jsx";
import PlaylistDetail from "../components/PlaylistDetail/PlaylistDetail.jsx";

// ✅ Protected route wrapper
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <div className="loading-screen">Loading...</div>;
  
  // If not authenticated, redirect to login
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// --- Main Routing Component ---
const AppRoutes = () => {
  return (
    <Routes>
      {/* ------------------- 1. Public Routes ------------------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* This route is often public, but since your backend getAllVideos 
        controller includes logic based on req.user, it's safer to protect it.
      */}
      <Route
        path="/"
        element={<PrivateRoute><Home /></PrivateRoute>}
      />
      <Route path="/channel/:username" element={<Channel />} />

      {/* ------------------- 2. Public/Unprotected Detail Routes ------------------- */}
      {/* Video detail view should be public, even if liking/commenting requires auth.
        We'll keep the video playback page public, as fetching a video by ID 
        is often allowed for non-logged-in users.
      */}
      <Route path="/video/:videoId" element={<VideoPlay />} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route
        path="/upload"
        element={<PrivateRoute><UploadVideo /></PrivateRoute>}
      />

      <Route path="/playlist" element={<PrivateRoute><PlaylistPage /></PrivateRoute>} />
      <Route path="/tweet" element={<PrivateRoute><TweetPage /></PrivateRoute>} />

      {/* ------------------- 4. Fallback Route ------------------- */}
      {/* Catch-all route redirects non-matching paths to the home page */}
      <Route path="*" element={<Navigate to="/" replace />} />

      <Route path="/playlist/:playlistId" element={<PrivateRoute><PlaylistDetail /></PrivateRoute>} />
    </Routes>
  );
};

export default AppRoutes;