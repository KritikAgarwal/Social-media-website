import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/LoginHeader.js';
import axios from "axios";
import ContentCard from "../components/ContentCard";

function ProfilePage() {
  const [user, setUser] = useState({
    username: localStorage.getItem('username'),
    realname: localStorage.getItem('realname'),
    avatar: localStorage.getItem('profilePic'),
  });
  const [posts, setPosts] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionToken');
    if (!sessionId) {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchUserCountsAndPosts = async () => {
      try {
        const postsResponse = await axios.get(`http://localhost:3001/postsByUser/${user.username}/`);
        if (postsResponse.status === 200) {
          if (postsResponse.data) {
            setPosts(postsResponse.data.posts);
          }
        } else {
          console.error('Failed to fetch user posts');
        }
      } catch (error) {
        console.error('Error fetching user counts and posts:', error);
      }
    };

    fetchUserCountsAndPosts();
  }, [user.username]);

  const handleLogout = () => {
    navigate('/logout');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleProfileUpdate = async () => {
    try {
      const token = localStorage.getItem('sessionToken');
      const response = await axios.put(`http://localhost:3001/user/${user.username}`, {
        realname: user.realname,
        avatar: user.avatar,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 200) {
        localStorage.setItem('realname', user.realname);
        localStorage.setItem('profilePic', user.avatar);
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleSaveProfile = () => {
    handleProfileUpdate();
    setIsEditing(false);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
        <Header user={user} onLogout={handleLogout} />
        <div className="h-16"></div>
        <div className="p-4">
          <div className="bg-white p-4 md:w-1/2 mx-auto shadow-lg rounded-lg">
            <div className="flex justify-center">
              <img
                  src={user.avatar}
                  alt={`${user.realname}'s Avatar`}
                  className="w-24 h-24 rounded-full"
              />
            </div>
            {isEditing ? (
                <div className="mt-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="avatar">
                    Avatar URL
                  </label>
                  <input
                      type="text"
                      id="avatar"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={user.avatar}
                      onChange={(e) => setUser({ ...user, avatar: e.target.value })}
                  />
                </div>
            ) : null}
            <h1 className="text-2xl font-bold text-center mt-4">
              {isEditing ? (
                  <input
                      type="text"
                      className="block w-full font-bold text-2xl p-2"
                      value={user.realname}
                      onChange={(e) => setUser({ ...user, realname: e.target.value })}
                  />
              ) : (
                  user.realname
              )}
            </h1>
            <p className="text-center text-gray-600 mt-2">
              {isEditing ? (
                  <input
                      type="text"
                      className="block w-full text-gray-600 p-2"
                      value={user.username}
                      onChange={(e) => setUser({ ...user, username: e.target.value })}
                  />
              ) : (
                  `@${user.username}`
              )}
            </p>
            {isEditing ? (
                <div className="flex justify-center mt-4">
                  <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-2 rounded-full"
                      onClick={handleSaveProfile}
                  >
                    Save
                  </button>
                  <button
                      className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 mx-2 rounded-full"
                      onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
            ) : (
                <div className="flex justify-center mt-4">
                  <button
                      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 mx-2 rounded-full"
                      onClick={handleEditProfile}
                  >
                    Edit Profile
                  </button>
                </div>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="bg-white p-4 md:w-1/2 mx-auto shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold text-center mt-4">Posts</h2>
            {posts.map((post, index) => (
                <ContentCard
                    key={index}
                    username={post.poster.username}
                    content={post.postText}
                    upvotes={post.upvotes}
                    downvotes={post.downvotes}
                    postId={post._id}
                    timePosted={post.createdAt}
                    profileLink={post.poster.profilePic}
                />
            ))}
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;