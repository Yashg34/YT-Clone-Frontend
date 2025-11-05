import React, { useEffect, useState, useContext } from "react";
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import "./Tweet.css";

const TweetPage = () => {
  const { user } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [editTweet, setEditTweet] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchTweets = async () => {
    if (!user?._id) return;
    try {
      setLoading(true);
      const res = await apiService.tweet.getUserTweets(user._id);
      if (res.data?.success) setTweets(res.data.data);
      else setTweets([]);
    } catch (err) {
      console.error("❌ Failed to fetch tweets:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editTweet) {
        await apiService.tweet.updateTweet(editTweet._id, { content: newTweet });
        setEditTweet(null);
      } else {
        await apiService.tweet.createTweet({ content: newTweet });
      }
      setNewTweet("");
      fetchTweets();
    } catch (err) {
      console.error("❌ Failed to post tweet:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tweet?")) return;
    try {
      await apiService.tweet.deleteTweet(id);
      setTweets(tweets.filter((t) => t._id !== id));
    } catch (err) {
      console.error("❌ Failed to delete tweet:", err);
    }
  };

  const handleEdit = (tweet) => {
    setNewTweet(tweet.content);
    setEditTweet(tweet);
  };

  return (
    <div className="tweet-page">
      <h2>🐦 Your Tweets</h2>

      <form className="tweet-form" onSubmit={handleSubmit}>
        <textarea
          placeholder="What's happening?"
          value={newTweet}
          onChange={(e) => setNewTweet(e.target.value)}
          required
        />
        <button type="submit">{editTweet ? "Update" : "Tweet"}</button>
        {editTweet && (
          <button type="button" onClick={() => setEditTweet(null)} className="cancel-btn">
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p>⏳ Loading tweets...</p>
      ) : tweets.length ? (
        <div className="tweet-list">
          {tweets.map((t) => (
            <div key={t._id} className="tweet-card">
              <p>{t.content}</p>
              <span className="tweet-date">{new Date(t.createdAt).toLocaleString()}</span>
              <div className="tweet-actions">
                <button onClick={() => handleEdit(t)}>✏️ Edit</button>
                <button onClick={() => handleDelete(t._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No tweets yet. Write one above!</p>
      )}
    </div>
  );
};

export default TweetPage;
