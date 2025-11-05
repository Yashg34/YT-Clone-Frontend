import React, { useState, useEffect } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";

// Note: You may want to rename or copy your CSS for this component
import "./SubscribeButton.css"; 

const SubscribeButton = ({
  channelName,
  initialIsSubscribed,
  initialSubscribersCount,
}) => {
  const { isAuthenticated } = useAuth();
  const [isSubscribed, setIsSubscribed] = useState(initialIsSubscribed);
  const [subscribersCount, setSubscribersCount] = useState(initialSubscribersCount);
  const [isProcessing, setIsProcessing] = useState(false);

  // Sync state with initial props when they change
  useEffect(() => {
    setIsSubscribed(initialIsSubscribed);
    setSubscribersCount(initialSubscribersCount);
  }, [initialIsSubscribed, initialSubscribersCount]);

  // 🔔 Subscribe Toggle Handler
  const handleToggleSubscription = async () => {
    if (!isAuthenticated) return alert("Please log in to subscribe.");
    if (!channelName) return console.error("Channel username missing.");
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      const res = await apiService.subscription.toggleSubscription(channelName);
      
      // Use the response data if available, otherwise toggle locally
      const newStatus = res?.data?.data?.isSubscribed ?? !isSubscribed;
      
      setIsSubscribed(newStatus);
      setSubscribersCount((prev) => (newStatus ? prev + 1 : prev - 1));
      
    } catch (err) {
      console.error("❌ Failed to toggle subscription:", err);
      alert("Unable to update subscription status.");
      
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleToggleSubscription}
      className={`subscribe-button ${
        isSubscribed ? "subscribed" : "not-subscribed"
      }`}
      disabled={isProcessing}
    >
      {isSubscribed ? "🔔 Subscribed" : "▶️ Subscribe"} ({subscribersCount})
    </button>
  );
};

export default SubscribeButton;