import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiService } from "../../services/apiService"; 
import SubscribeButton from "../../components/EngagementButton/SubscribeButton";
import LikeButton from "../../components/EngagementButton/LikeButton"; // 💡 Imported LikeButton
import "./Channel.css";

const Channel = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const [channelData, setChannelData] = useState(null);
  const [videos, setVideos] = useState([]);
  const [tweets, setTweets] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [loadingTweets, setLoadingTweets] = useState(false);

  const fetchChannelData = async () => {
    try {
      const res = await apiService.user.getUserChannelProfile(username);
      const data = res.data?.data;
      setChannelData(data);
      setVideos(data?.videos || []);
    } catch (err) {
      console.error("Error fetching channel data:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTweets = async (userId) => {
    if (!userId) return;
    setLoadingTweets(true);
    try {
      // Assumes apiService.tweet.getUserTweets exists and returns isLiked/likesCount
      const res = await apiService.tweet.getUserTweets(userId);
      setTweets(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching user tweets:", err);
    } finally {
      setLoadingTweets(false);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [username]);

  useEffect(() => {
    if (channelData?._id) {
      // Assuming channelData._id is the userId needed for the tweet API
      fetchUserTweets(channelData._id);
    }
  }, [channelData]);


  const handleVideoClick = (videoId) => {
    navigate(`/video/${videoId}`);
  };

  if (loading) return <div className="loader">Loading channel...</div>;
  if (!channelData) return <div className="error">Channel not found</div>;

  const {
    username: channelName,
    avatar,
    description,
    subscribersCount,
    isSubscribedToMe,
  } = channelData;

  return (
    <div className="channel-container">
      <div className="channel-header">
        <div className="channel-avatar">
          <img src={avatar} alt={channelName} />
        </div>
        <div className="channel-info-wrapper">
          <div className="channel-info">
            <h2>{channelName}</h2>
            <p>{description || "No description provided."}</p>
          </div>

          <div className="subscribe-button-container">
            <SubscribeButton
              channelName={channelName}
              initialIsSubscribed={isSubscribedToMe || false}
              initialSubscribersCount={subscribersCount || 0}
            />
          </div>
        </div>
      </div>

      <div className="channel-videos">
        <h3>Videos</h3>
        <div className="video-grid">
          {videos.length === 0 ? (
            <p>No videos uploaded yet.</p>
          ) : (
            videos.map((video) => (
              <div
                key={video._id}
                className="video-card"
                onClick={() => handleVideoClick(video._id)}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="video-thumbnail"
                />
                <h4>{video.title}</h4>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* 🐦 SECTION: DISPLAY USER TWEETS */}
      <hr /> 
      <div className="user-tweets">
        <h3>{channelName}'s Tweets</h3>
        {loadingTweets ? (
          <div className="loader">Loading tweets...</div>
        ) : tweets.length === 0 ? (
          <p>No tweets found.</p>
        ) : (
          <div className="tweets-list">
            {tweets.map((tweet) => (
              <div key={tweet._id} className="tweet-card">
                <p className="tweet-content">{tweet.content}</p>
                <small className="tweet-date">
                  {new Date(tweet.createdAt).toLocaleDateString()}
                </small>
                <LikeButton
                  entityId={tweet._id}
                  type="tweet"
                  initialIsLiked={tweet.isLiked || false}
                  initialLikesCount={tweet.likesCount || 0}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;