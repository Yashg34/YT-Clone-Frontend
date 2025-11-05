import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext"; 

import LikeButton from "../../components/EngagementButton/LikeButton";
import SubscribeButton from "../../components/EngagementButton/SubscribeButton";
import Comments from "../../components/Comments/Comments";
import "./VideoPlay.css";

const VideoPlay = () => {
  const { videoId } = useParams();
  const navigate = useNavigate();

  const { 
    isAuthenticated, 
    user: currentUser, 
    loading: authLoading, 
    fetchUser: refreshCurrentUser 
  } = useAuth();

  const [videoDetails, setVideoDetails] = useState(null);
  const [videoLoading, setVideoLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // ✅ Get actual user object even if AuthContext returns wrapped data
  const actualUser = currentUser?.data || currentUser || null;
  const currentUserId = actualUser?._id;

  const fetchVideoDetails = useCallback(async () => {
    if (!videoId) {
      setError("Invalid video ID.");
      setVideoLoading(false);
      return;
    }

    try {
      const res = await apiService.video.getVideoById(videoId);
      const videoData = res?.data?.data?.[0];
      if (!videoData) throw new Error("No video data found.");

      setVideoDetails(videoData);

      if (isAuthenticated && refreshCurrentUser) {
        await refreshCurrentUser();
      }
    } catch (err) {
      console.error("Error fetching video:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setVideoLoading(false);
    }
  }, [videoId, isAuthenticated, refreshCurrentUser]);

  useEffect(() => {
    fetchVideoDetails();
  }, [fetchVideoDetails]);

  // ✅ Save video to playlist
  const handleSaveToPlaylist = async () => {
    if (!isAuthenticated) {
      alert("Please log in to save videos to a playlist.");
      return;
    }

    if (!currentUserId) {
      console.warn("User ID not available:", currentUser);
      alert("User ID is not available. Please try refreshing the page.");
      return;
    }

    setIsSaving(true);
    try {
      const playlistRes = await apiService.playlist.getUserPlaylists(currentUserId);
      const playlists = playlistRes.data?.data || [];

      if (playlists.length === 0) {
        alert("You have no playlists. Please create one first.");
        return;
      }

      const playlistOptions = playlists.map((p, i) => `${i + 1}: ${p.name}`).join("\n");
      const selection = prompt(`Select a playlist:\n\n${playlistOptions}`);
      if (!selection) return;

      const selectedIndex = parseInt(selection) - 1;
      const selectedPlaylist = playlists[selectedIndex];
      if (!selectedPlaylist) {
        alert("Invalid selection.");
        return;
      }

      const isAlreadyInPlaylist = selectedPlaylist.videos.includes(videoId);
      if (isAlreadyInPlaylist) {
        alert(`Video is already in "${selectedPlaylist.name}".`);
        return;
      }

      await apiService.playlist.addVideoToPlaylist(videoId, selectedPlaylist._id);
      alert(`✅ Video added to "${selectedPlaylist.name}" successfully!`);
    } catch (err) {
      console.error("Error saving to playlist:", err);
      alert(`❌ Failed to save video: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  if (videoLoading || authLoading) return <div className="loading-state">Loading video...</div>;
  if (error) return <div className="error-state">{error}</div>;
  if (!videoDetails) return <div className="no-data-state">Video not found.</div>;

  const owner = videoDetails.owner || {};
  const ownerName = owner.username || "Unknown Channel";
  const publishDate = videoDetails.createdAt
    ? new Date(videoDetails.createdAt).toLocaleDateString()
    : "N/A";

  return (
    <div className="video-play-page-wrapper">
      {/* 🎥 Video Section */}
      <div className="video-player-section">
        <video
          controls
          src={videoDetails.videoFile}
          poster={videoDetails.thumbnail}
          className="main-video-player"
          autoPlay
        />

        <h1 className="video-title-main">
          {videoDetails.title || "Untitled Video"}
        </h1>

        <div className="video-metadata-line">
          <span>{videoDetails.views || 0} views</span>
          <span className="dot-separator"> • </span>
          <span>Published on {publishDate}</span>
        </div>

        {/* --- ENGAGEMENT BUTTONS --- */}
        <div className="engagement-buttons-group">
          <LikeButton
            entityId={videoId}
            type="video"
            initialIsLiked={videoDetails.isLikedByUser || false}
            initialLikesCount={videoDetails.likesCount || 0}
          />

          <SubscribeButton
            channelName={ownerName}
            initialIsSubscribed={videoDetails.isSubscribedToOwner || false}
            initialSubscribersCount={videoDetails.subscribersCount || 0}
          />

          {/* 💾 Save to Playlist Button */}
          <button
            onClick={handleSaveToPlaylist}
            className="save-to-playlist-button"
            disabled={isSaving || !isAuthenticated}
          >
            {isSaving ? "Saving..." : "💾 Save"}
          </button>
        </div>

        {/* 👤 Channel Info */}
        <div className="channel-description-area">
          <div
            className="channel-info-display"
            onClick={() => navigate(`/channel/${ownerName}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={owner.avatar || "/default-avatar.png"}
              alt={ownerName}
              className="channel-avatar-large"
            />
            <span className="channel-name-link">{ownerName}</span>
          </div>

          <p className="video-description-text">
            {videoDetails.description || "No description provided."}
          </p>
        </div>
      </div>

      {/* 💬 Comments Section */}
      <div className="comments-section-wrapper">
        <Comments videoId={videoId} />
      </div>
    </div>
  );
};

export default VideoPlay;
