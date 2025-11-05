import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Import useNavigate
import { apiService } from "../../services/apiService";
import { useAuth } from "../../context/AuthContext";
import "./Playlist.css";

const PlaylistPage = () => {
    const { user } = useAuth();
    const navigate = useNavigate(); // 👈 Initialize useNavigate
    const [playlists, setPlaylists] = useState([]);
    const [newPlaylist, setNewPlaylist] = useState({ name: "", description: "" });
    const [loading, setLoading] = useState(false);
    const [editPlaylist, setEditPlaylist] = useState(null);

    // ✅ Fetch current user's playlists
    const fetchPlaylists = async () => {
        if (!user?._id) return;
        try {
            setLoading(true);
            const res = await apiService.playlist.getUserPlaylists(user._id);
            if (res.data?.success) setPlaylists(res.data.data);
            else setPlaylists([]);
        } catch (err) {
            console.error("❌ Failed to fetch playlists:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPlaylists();
    }, [user]);

    // ✅ Create Playlist
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await apiService.playlist.createPlaylist(newPlaylist);
            if (res.data?.success) {
                setNewPlaylist({ name: "", description: "" });
                fetchPlaylists();
            }
        } catch (err) {
            console.error("❌ Failed to create playlist:", err);
            alert(`Failed to create: ${err.response?.data?.message || err.message}`);
        }
    };

    // ✅ Delete Playlist
    const handleDelete = async (id) => {
        if (!window.confirm("Delete this playlist?")) return;
        try {
            await apiService.playlist.deletePlaylist(id);
            setPlaylists(playlists.filter((p) => p._id !== id));
        } catch (err) {
            console.error("❌ Failed to delete playlist:", err);
            alert(`Failed to delete: ${err.response?.data?.message || err.message}`);
        }
    };

    // ✅ Update Playlist
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const res = await apiService.playlist.updatePlaylist(editPlaylist._id, {
                name: editPlaylist.name,
                description: editPlaylist.description,
            });
            if (res.data?.success) {
                setEditPlaylist(null);
                fetchPlaylists();
            }
        } catch (err) {
            console.error("❌ Failed to update playlist:", err);
            alert(`Failed to update: ${err.response?.data?.message || err.message}`);
        }
    };
    
    // 🚀 NEW: Navigate to the playlist detail page
    const handlePlaylistClick = (playlistId) => {
        navigate(`/playlist/${playlistId}`);
    };


    return (
        <div className="playlist-page">
            <h2>🎵 Your Playlists</h2>

            <form className="playlist-form" onSubmit={editPlaylist ? handleUpdate : handleCreate}>
                {/* ... (form inputs remain the same) ... */}
                <input
                    type="text"
                    placeholder="Playlist Name"
                    value={editPlaylist ? editPlaylist.name : newPlaylist.name}
                    onChange={(e) =>
                        editPlaylist
                            ? setEditPlaylist({ ...editPlaylist, name: e.target.value })
                            : setNewPlaylist({ ...newPlaylist, name: e.target.value })
                    }
                    required
                />
                <input
                    type="text"
                    placeholder="Description"
                    value={editPlaylist ? editPlaylist.description : newPlaylist.description}
                    onChange={(e) =>
                        editPlaylist
                            ? setEditPlaylist({ ...editPlaylist, description: e.target.value })
                            : setNewPlaylist({ ...newPlaylist, description: e.target.value })
                    }
                    required
                />
                <button type="submit">{editPlaylist ? "Update" : "Create"}</button>
                {editPlaylist && (
                    <button type="button" onClick={() => setEditPlaylist(null)} className="cancel-btn">
                        Cancel
                    </button>
                )}
            </form>

            {loading ? (
                <p>⏳ Loading playlists...</p>
            ) : playlists.length ? (
                <div className="playlist-list">
                    {playlists.map((p) => (
                        <div 
                            key={p._id} 
                            className="playlist-card" 
                            onClick={() => handlePlaylistClick(p._id)} // 👈 Add click handler
                            style={{ cursor: 'pointer' }} // Visual indicator
                        >
                            <h3>{p.name}</h3>
                            <p>{p.description}</p>
                            <small>{p.videos?.length || 0} videos</small>
                            <div className="playlist-actions" onClick={(e) => e.stopPropagation()}> 
                                {/* 👈 Stop propagation so clicking buttons doesn't trigger navigation */}
                                <button onClick={() => setEditPlaylist(p)}>✏️ Edit</button>
                                <button onClick={() => handleDelete(p._id)}>🗑️ Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No playlists yet. Create one above!</p>
            )}
        </div>
    );
};

export default PlaylistPage;