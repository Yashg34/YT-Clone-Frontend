import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiService } from "../../services/apiService";
import "./Comments.css";

const Comments = ({ videoId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch comments
  const fetchComments = async () => {
  try {
    setLoading(true);
    const res = await apiService.comment.getVideoComments(videoId);

    // ✅ Correct extraction of array
    const commentsArray = res.data?.data?.comments || [];
    setComments(commentsArray);
  } catch (err) {
    console.error("Failed to load comments:", err);
    setError("Could not load comments.");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    if (videoId) fetchComments();
  }, [videoId]);

  // ✅ Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await apiService.comment.addComment(videoId, {
        content: newComment,
      });
      setComments((prev) => [res.data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment:", err);
    }
  };

  // ✅ Delete comment
  const handleDelete = async (commentId) => {
    try {
      await apiService.comment.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Failed to delete comment:", err);
    }
  };

  // ✅ Edit comment
  const handleEdit = async (commentId) => {
    if (!editingText.trim()) return;
    try {
      const res = await apiService.comment.updateComment(commentId, {
        content: editingText,
      });
      setComments((prev) =>
        prev.map((c) => (c._id === commentId ? res.data.data : c))
      );
      setEditingId(null);
      setEditingText("");
    } catch (err) {
      console.error("Failed to update comment:", err);
    }
  };

  // ✅ Render
  if (loading) return <p className="comment-loading">Loading comments...</p>;
  if (error) return <p className="comment-error">{error}</p>;

  return (
    <div className="comments-section">
      <h3 className="comments-title">Comments</h3>

      {user ? (
        <form className="comment-form" onSubmit={handleAddComment}>
          <img src={user.avatar} alt={user.username} className="user-avatar" />
          <input
            type="text"
            placeholder="Add a public comment..."
            className="comment-input"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="comment-btn">
            Comment
          </button>
        </form>
      ) : (
        <p className="login-prompt">Login to post a comment.</p>
      )}

      <div className="comment-list">
        {comments.length === 0 && (
          <p className="no-comments">No comments yet. Be the first!</p>
        )}

        {comments.map((c) => (
          <div key={c._id} className="comment-item">
            <img
              src={c.owner?.avatar}
              alt={c.owner?.username}
              className="comment-avatar"
            />
            <div className="comment-content">
              <div className="comment-header">
                <span className="comment-user">{c.owner?.username}</span>
                <span className="comment-date">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>

              {editingId === c._id ? (
                <>
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="comment-edit-input"
                  />
                  <div className="comment-edit-actions">
                    <button
                      onClick={() => handleEdit(c._id)}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditingText("");
                      }}
                      className="cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <p className="comment-text">{c.content}</p>
              )}

              {user?._id === c.user?._id && editingId !== c._id && (
                <div className="comment-actions">
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(c._id);
                      setEditingText(c.content);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
