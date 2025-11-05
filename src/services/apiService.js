import axiosInstance from './axiosInstance.js';

// --- User Services (/users) ---
const user = {
    registerUser: (formData, config) => 
        axiosInstance.post(`/users/register`, formData, config),
    
    loginUser: (credentials) => 
        axiosInstance.post(`/users/login`, credentials),
    
    logoutUser: () => 
        axiosInstance.post(`/users/logout`),
    
    refreshAccessToken: () => 
        axiosInstance.post(`/users/refreshToken`),
    
    changePassword: (passwords) => 
        axiosInstance.post(`/users/change-password`, passwords),
    
    getCurrentUser: () => 
        axiosInstance.get(`/users/current-user`),
    
    updateAccountDetails: (details) => 
        axiosInstance.patch(`/users/update-account`, details),
    
    updateUserAvatar: (avatarFile, config) => 
        axiosInstance.patch(`/users/avatar`, avatarFile, config),
    
    updateUserCoverImage: (coverImageFile, config) => 
        axiosInstance.patch(`/users/cover-image`, coverImageFile, config),
    
    getUserChannelProfile: (username) => 
        axiosInstance.get(`/users/c/${username}`),
    
    getWatchHistory: () => 
        axiosInstance.get(`/users/history`),
};

// --- Video Services (/videos) ---
const video = {
    getAllVideos: (queryParams = {}) => 
        axiosInstance.get(`/videos`, { params: queryParams }),
    
    publishAVideo: (videoData, config) => 
        axiosInstance.post(`/videos`, videoData, config),
    
    getVideoById: (videoId) => 
        axiosInstance.get(`/videos/${videoId}`),
    
    deleteVideo: (videoId) => 
        axiosInstance.delete(`/videos/${videoId}`),
    
    updateVideo: (videoId, updateData, config) => 
        axiosInstance.patch(`/videos/${videoId}`, updateData, config),
    
    togglePublishStatus: (videoId) => 
        axiosInstance.patch(`/videos/toggle/publish/${videoId}`),
};

// --- Comment Services (/comments) ---
const comment = {
    getVideoComments: (videoId, queryParams = {}) => 
        axiosInstance.get(`/comments/${videoId}`, { params: queryParams }),
    
    addComment: (videoId, commentData) => 
        axiosInstance.post(`/comments/${videoId}`, commentData),
    
    deleteComment: (commentId) => 
        axiosInstance.delete(`/comments/c/${commentId}`),
    
    updateComment: (commentId, updateData) => 
        axiosInstance.patch(`/comments/c/${commentId}`, updateData),
};

// --- Like Services (/likes) ---
const like = {
    toggleVideoLike: (videoId) => 
        axiosInstance.post(`/likes/toggle/v/${videoId}`),
    
    toggleCommentLike: (commentId) => 
        axiosInstance.post(`/likes/toggle/c/${commentId}`),
    
    toggleTweetLike: (tweetId) => 
        axiosInstance.post(`/likes/toggle/t/${tweetId}`),
    
    getLikedVideos: () => 
        axiosInstance.get(`/likes/videos`),
};

// --- Subscription Services (/subscriptions) ---
const subscription = {
    toggleSubscription: (channelName) => 
        axiosInstance.post(`/subscriptions/c/${channelName}`),
    
    getSubscribedChannels: () => 
        axiosInstance.get(`/subscriptions/c`),
    
    getUserChannelSubscribers: (channelName) => 
        axiosInstance.get(`/subscriptions/u/${channelName}`),
};

// --- Playlist Services (/playlist) ---
const playlist = {
    createPlaylist: (playlistData) => 
        axiosInstance.post(`/playlists`, playlistData),
    
    getPlaylistById: (playlistId) => 
        axiosInstance.get(`/playlists/${playlistId}`),
    
    updatePlaylist: (playlistId, updateData) => 
        axiosInstance.patch(`/playlists/${playlistId}`, updateData),
    
    deletePlaylist: (playlistId) => 
        axiosInstance.delete(`/playlists/${playlistId}`),
    
    addVideoToPlaylist: (videoId, playlistId) => 
        axiosInstance.patch(`/playlists/add/${videoId}/${playlistId}`),
    
    removeVideoFromPlaylist: (videoId, playlistId) => 
        axiosInstance.patch(`/playlists/remove/${videoId}/${playlistId}`),

    getUserPlaylists: (userId) => 
        axiosInstance.get(`/playlists/user/${userId}`),
};

// --- Tweet Services (/tweets) ---
const tweet = {
    createTweet: (tweetData) => 
        axiosInstance.post(`/tweets`, tweetData),
    
    getUserTweets: (userId) => 
        axiosInstance.get(`/tweets/user/${userId}`),
    
    updateTweet: (tweetId, updateData) => 
        axiosInstance.patch(`/tweets/${tweetId}`, updateData),
    
    deleteTweet: (tweetId) => 
        axiosInstance.delete(`/tweets/${tweetId}`),
};

// --- Dashboard Services (/dashboard) ---
const dashboard = {
    getChannelStats: () => 
        axiosInstance.get(`/dashboard/stats`),
    
    getChannelVideos: () => 
        axiosInstance.get(`/dashboard/videos`),
    
    engagementStatus: (videoId, channelId) => 
        axiosInstance.get(`/dashboard/engagement/${videoId}/${channelId}`),
};

// --- Healthcheck Service (/healthcheck) ---
const healthcheckService = {
    healthcheck: () => 
        axiosInstance.get(`/healthcheck`),
};


// Export the main service object containing all nested modules
export const apiService = {
    user,
    video,
    comment,
    like,
    subscription,
    playlist,
    tweet,
    dashboard,
    healthcheckService,
};