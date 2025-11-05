import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";

// Note: You may want to rename or copy your CSS for this component
import "./LikeButton.css"; 

const LikeButton = ({ 
  entityId, // ID of the video, comment, or tweet
  type,     // Must be 'video', 'comment', or 'tweet'
  initialIsLiked,
  initialLikesCount,
}) => {
  const { isAuthenticated } = useAuth();
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state with initial props when they change
  useEffect(() => {
    setIsLiked(initialIsLiked);
    setLikesCount(initialLikesCount);
  }, [initialIsLiked, initialLikesCount]);

  // ❤️ Like Toggle Handler
  const handleToggleLike = async () => {
    if (!isAuthenticated) return alert("Please log in to like this item.");
    if (isProcessing) return;
    setIsProcessing(true);

    let apiCall;
    switch (type) {
      case 'video':
        apiCall = apiService.like.toggleVideoLike;
        break;
      case 'comment':
        apiCall = apiService.like.toggleCommentLike;
        break;
      case 'tweet':
        // Assuming an equivalent API service method for tweets exists
        apiCall = apiService.like.toggleTweetLike; 
        break;
      default:
        console.error("Invalid like entity type:", type);
        setIsProcessing(false);
        return;
    }

    try {
      // Pass the entityId to the appropriate toggle function
      await apiCall(entityId); 
      
      setIsLiked((prev) => !prev);
      setLikesCount((prev) => (isLiked ? prev - 1 : prev + 1));

    } catch (err) {
      console.error(`❌ Failed to toggle ${type} like:`, err);
      alert(`Unable to update ${type} like status.`);
      
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      className={`like-button ${isLiked ? "liked" : ""}`}
      disabled={isProcessing}
    >
      {isLiked ? "❤️ Liked" : "🤍 Like"} ({likesCount})
    </button>
  );
};

export default LikeButton;