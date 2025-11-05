import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/apiService'; // Adjust the path as necessary
import './Home.css'; 
// 💡 NEW: Import the navigation hook
import { useNavigate } from 'react-router-dom'; 

// Helper functions (formatDuration, formatViews) remain the same

const formatDuration = (seconds) => {
    if (typeof seconds !== 'number' || isNaN(seconds)) return '0:00';

    const date = new Date(0);
    date.setSeconds(seconds);
    
    if (seconds >= 3600) {
        return date.toISOString().substring(11, 19); // HH:MM:SS
    }
    return date.toISOString().substring(14, 19); // MM:SS
};

const formatViews = (views) => {
    if (views >= 1000000) {
        return (views / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (views >= 1000) {
        return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return views.toString();
};


const HomePage = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // 💡 NEW: Initialize the navigate function
    const navigate = useNavigate();

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const queryParams = { 
                    page: 1, 
                    limit: 10,
                };
                
                const response = await apiService.video.getAllVideos(queryParams);
                const videoData = response.data.data.videos || [];
                
                setVideos(videoData);
                setLoading(false);

            } catch (err) {
                console.error("Failed to fetch videos:", err);
                setError("Failed to load videos. Please try again later.");
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    // 💡 NEW: Handler function for clicking a video card
    const handleVideoClick = (videoId) => {
        // Navigates to the route defined for video playback, passing the videoId as a URL parameter
        navigate(`/video/${videoId}`);
    };

    if (loading) {
        return <div className="loading-state">Loading videos...</div>;
    }

    if (error) {
        return <div className="error-state">Error: {error}</div>;
    }

    if (videos.length === 0) {
        return <div className="no-videos-state">No videos published yet.</div>;
    }

    return (
        <div className="homepage-container">
            <header className="page-header">
                <h2>🎬 Recommended Videos</h2>
            </header>
            <div className="video-grid">
                {videos.map((video) => (
                    <div 
                        key={video._id} 
                        className="video-card"
                        // 💡 MODIFIED: Added onClick handler here
                        onClick={() => handleVideoClick(video._id)} 
                    >
                        
                        {/* 1. Thumbnail and Duration */}
                        <div className="thumbnail-container">
                            <img 
                                src={video.thumbnail} 
                                alt={video.title} 
                                className="video-thumbnail" 
                            />
                            <span className="duration-overlay">
                                {formatDuration(video.duration)}
                            </span>
                        </div>

                        <div className="video-info">
                            {/* 2. Owner Avatar */}
                            <div className="owner-avatar-container">
                                <img 
                                    src={video.owner.avatar} 
                                    alt={video.owner.username} 
                                    className="owner-avatar" 
                                />
                            </div>
                            
                            {/* 3. Title, Views, and Owner Details */}
                            <div className="text-content">
                                <h3 className="video-title">{video.title}</h3>
                                <p className="channel-name">
                                    {video.owner.fullName || video.owner.username}
                                </p>
                                <p className="video-meta">
                                    {formatViews(video.views)} views • {new Date(video.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;