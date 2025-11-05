import React, { useState } from "react";
import { apiService } from "../../services/apiService";
import { useNavigate } from "react-router-dom";
import "./VideoUpload.css";

const UploadVideo = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Helper to clear form state
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setVideoFile(null);
    setThumbnail(null);
    setUploadProgress(0);
    setError(null);
    setSuccess(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);

    if (!title || !description || !videoFile || !thumbnail) {
      setError("All fields (Title, Description, Video, Thumbnail) are required.");
      return;
    }

    // 1. Prepare FormData for file upload
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnail);

    // 2. Configure request with progress tracking and headers
    const config = {
      headers: {
        // Axios sets Content-Type to multipart/form-data automatically when using FormData
        // We only need to provide the onUploadProgress callback for tracking
      },
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setUploadProgress(percentCompleted);
      },
    };

    setUploading(true);
    setSuccess(false);

    try {
      // 3. API Call
      const res = await apiService.video.publishAVideo(formData, config);

      setSuccess(true);
      
      // Optional: Navigate to the newly published video page
      const newVideoId = res.data?.data?._id;
      if (newVideoId) {
        setTimeout(() => navigate(`/video/${newVideoId}`), 2000);
      } else {
        setTimeout(() => navigate('/channel/me'), 2000);
      }
      
    } catch (err) {
      console.error("Video upload failed:", err);
      setError(
        err.response?.data?.message || "An unknown error occurred during upload."
      );
      setUploadProgress(0); // Reset progress on failure
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="upload-container">
      <h2 className="upload-title">🎥 Upload a New Video</h2>
      
      {/* Loading/Status Messages */}
      {error && <p className="status-message error">{error}</p>}
      {success && <p className="status-message success">✅ Video published successfully!</p>}
      
      {uploading && (
        <div className="upload-progress-bar-container">
          <div 
            className="upload-progress-bar" 
            style={{ width: `${uploadProgress}%` }}
          >
            {uploadProgress}%
          </div>
          <p className="upload-progress-text">Uploading... Please wait.</p>
        </div>
      )}

      <form className="upload-form" onSubmit={handleUpload}>
        
        {/* Title and Description */}
        <input
          type="text"
          placeholder="Video Title (Required)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="form-input"
          disabled={uploading}
          maxLength={100}
          required
        />
        <textarea
          placeholder="Video Description (Required)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-textarea"
          rows="4"
          disabled={uploading}
          maxLength={1000}
          required
        />

        {/* Video File Upload */}
        <div className="file-input-group">
          <label htmlFor="videoFile">Video File:</label>
          <input
            type="file"
            id="videoFile"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="file-input"
            disabled={uploading}
            required
          />
          {videoFile && <span className="file-name">{videoFile.name}</span>}
        </div>

        {/* Thumbnail File Upload */}
        <div className="file-input-group">
          <label htmlFor="thumbnailFile">Thumbnail Image:</label>
          <input
            type="file"
            id="thumbnailFile"
            accept="image/*"
            onChange={(e) => setThumbnail(e.target.files[0])}
            className="file-input"
            disabled={uploading}
            required
          />
          {thumbnail && <span className="file-name">{thumbnail.name}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={uploading || success}>
          {uploading ? "Publishing..." : "Publish Video"}
        </button>
        
        {success && <button type="button" className="reset-btn" onClick={resetForm}>Upload Another</button>}
      </form>
    </div>
  );
};

export default UploadVideo;