import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService";
// Assume you'll need a way to remove videos from the playlist here, too.
import "./PlaylistDetail.css";
const PlaylistDetail = () => {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Fetch playlist details and all video data
    const fetchPlaylistDetails = async () => {
        if (!playlistId) return;

        try {
            setLoading(true);
            setError(null);
            
            // 1. Fetch Playlist Data
            const playlistRes = await apiService.playlist.getPlaylistById(playlistId);
            const playlistData = playlistRes.data?.data;

            if (!playlistData) {
                setError("Playlist not found.");
                setLoading(false);
                return;
            }
            setPlaylist(playlistData);

            // 2. Fetch individual Video Details concurrently
            const videoIds = playlistData.videos || [];
            
            if (videoIds.length === 0) {
                setVideos([]);
                setLoading(false);
                return;
            }

            // Create an array of promises for fetching each video
            const videoPromises = videoIds.map(id => apiService.video.getVideoById(id));
            
            // Wait for all video requests to complete
            const videoResponses = await Promise.all(videoPromises);
            
            // Extract the video data from the responses
            const fetchedVideos = videoResponses
                .map(res => res.data?.data?.[0]) // The API returns video data in res.data.data[0]
                .filter(video => video !== undefined);

            setVideos(fetchedVideos);

        } catch (err) {
            console.error("❌ Error fetching playlist details:", err);
            setError(`Failed to load playlist: ${err.response?.data?.message || err.message}`);
            setVideos([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylistDetails();
    }, [playlistId]);
    
    // 🚀 Click handler to navigate to video playback
    const handleVideoClick = (videoId) => {
        navigate(`/video/${videoId}`); // Navigates to the VideoPlay component
    };

    if (loading) return <div className="loading-state">⏳ Loading Playlist...</div>;
    if (error) return <div className="error-state">❌ {error}</div>;
    if (!playlist) return <div className="no-data-state">Playlist not found.</div>;


    return (
        <div className="playlist-detail-page">
            <h1 className="playlist-title">{playlist.name}</h1>
            <p className="playlist-description">{playlist.description}</p>
            <p className="video-count">{videos.length} videos</p>

            <div className="playlist-videos-grid">
                {videos.length === 0 ? (
                    <p className="empty-playlist">This playlist is empty.</p>
                ) : (
                    videos.map((video) => (
                        <div 
                            key={video._id} 
                            className="playlist-video-card" 
                            onClick={() => handleVideoClick(video._id)} // 👈 Navigation
                            style={{ cursor: 'pointer' }}
                        >
                            <img src={video.thumbnail} alt={video.title} className="video-thumbnail" />
                            <div className="video-info">
                                <h4>{video.title}</h4>
                                <p className="video-owner">By: {video.owner?.username || "N/A"}</p>
                                <p className="video-views">{video.views} views</p>
                                {/* You could add a 'Remove from Playlist' button here */}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default PlaylistDetail;