import React, { useEffect, useState } from "react";
import { apiService } from "../../services/apiService";
import "./ChannelVideos.css";

const ChannelVideos = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({ title: "", description: "" });
  const [saving, setSaving] = useState(false);

  // ✅ Fetch channel videos
  useEffect(() => {
    const fetchChannelVideos = async () => {
      try {
        setLoading(true);
        const res = await apiService.dashboard.getChannelVideos();
        console.log("🎥 API Response:", res.data);

        if (Array.isArray(res.data?.data)) {
          setVideos(res.data.data);
        } else {
          setVideos([]);
        }
      } catch (err) {
        console.error("❌ Failed to fetch channel videos:", err);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelVideos();
  }, []);

  // ✅ Handle edit button click
  const handleEditClick = (video) => {
    setSelectedVideo(video);
    setEditData({
      title: video.title,
      description: video.description,
    });
    setEditMode(true);
  };

  // ✅ Handle video update
  const handleSaveChanges = async () => {
    if (!selectedVideo) return;
    try {
      setSaving(true);
      const res = await apiService.video.updateVideo(selectedVideo._id, editData);
      alert("✅ Video updated successfully!");
      setEditMode(false);

      // Refresh list
      const refreshed = await apiService.dashboard.getChannelVideos();
      setVideos(refreshed.data?.data || []);
    } catch (err) {
      console.error("❌ Failed to update video:", err);
      alert("Failed to update video details.");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Handle publish toggle
  const handleTogglePublish = async (videoId) => {
    try {
      await apiService.video.togglePublishStatus(videoId);
      const refreshed = await apiService.dashboard.getChannelVideos();
      setVideos(refreshed.data?.data || []);
    } catch (err) {
      console.error("❌ Failed to toggle publish:", err);
      alert("Failed to toggle publish status.");
    }
  };

  // ✅ Handle delete
  const handleDelete = async (videoId) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await apiService.video.deleteVideo(videoId);
      alert("🗑️ Video deleted successfully!");
      setVideos((prev) => prev.filter((v) => v._id !== videoId));
    } catch (err) {
      console.error("❌ Failed to delete video:", err);
      alert("Failed to delete video.");
    }
  };

  if (loading) return <p className="loading">🎬 Fetching your uploaded videos...</p>;
  if (!videos.length) return <p className="no-videos">You haven’t uploaded any videos yet.</p>;

  return (
    <div className="channel-videos-page">
      <h2 className="channel-title">🎥 Your Uploaded Videos</h2>

      <div className="channel-videos-container">
        {videos.map((video) => (
          <div key={video._id} className="video-card">
            <div className="thumbnail" onClick={() => setSelectedVideo(video)}>
              <img src={video.thumbnail} alt={video.title} loading="lazy" />
            </div>
            <div className="video-info">
              <h3 className="video-title">{video.title}</h3>
              <p className="video-desc">{video.description?.slice(0, 60)}...</p>
              <span className="video-meta">
                {video.views} views • {new Date(video.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="video-actions">
              <button onClick={() => handleEditClick(video)}>✏️ Edit</button>
              <button onClick={() => handleTogglePublish(video._id)}>
                {video.isPublished ? "Unpublish" : "Publish"}
              </button>
              <button className="delete-btn" onClick={() => handleDelete(video._id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ✅ Edit Modal */}
      {editMode && selectedVideo && (
        <div className="video-modal" onClick={() => setEditMode(false)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>✏️ Edit Video</h3>
            <input
              type="text"
              placeholder="Title"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            />
            <textarea
              placeholder="Description"
              value={editData.description}
              onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            />
            <div className="edit-actions">
              <button onClick={() => setEditMode(false)}>Cancel</button>
              <button onClick={handleSaveChanges} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ✅ Video View Modal */}
      {selectedVideo && !editMode && (
        <div className="video-modal" onClick={() => setSelectedVideo(null)}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <video src={selectedVideo.videoFile} controls autoPlay className="video-player" />
            <h3>{selectedVideo.title}</h3>
            <p>{selectedVideo.description}</p>
            <p className="video-meta">
              {selectedVideo.views} views • {new Date(selectedVideo.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelVideos;
