import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../components/LoginHeader.js';
import axios from "axios";
import ContentCard from "../components/ContentCard";

function OtherProfilePage() {
  const {username} = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionToken');
    if (!sessionId) {
      navigate('/');
    }
    const fetchUserCountsAndPosts = async () => {
      try {
        const postsResponse = await axios.get(`http://localhost:3001/postsByUser/${username}/`);
        if (postsResponse.status === 200) {
          if (postsResponse.data) {
            setPosts(postsResponse.data.posts);
          }
        } else {
          console.error('Failed to fetch user posts');
        }

        const userResponse = await axios.get(`http://localhost:3001/user/${username}/`);
        if (userResponse.status === 200) {
          if (userResponse.data) {
            setUser(userResponse.data.user);
          }
        } else {
          console.error('Failed to fetch user realname');
        }
      } catch (error) {
        console.error('Error fetching user counts and posts:', error);
      }
    };
    fetchUserCountsAndPosts();
  }, );

  const trueUser = {
    username: localStorage.getItem('username'),
    realname: localStorage.getItem('realname'),
    avatar: localStorage.getItem('profilePic'),
  };

  const navigate = useNavigate();
  const handleLogout = () => {
    console.log('User logged out');
    navigate('/logout');
  };

  return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
        {user ? (
            <>
              <Header user={trueUser} onLogout={handleLogout}/>
              <div className="h-16"></div>
              <div className="p-4">
                <div className="bg-white p-4 md:w-1/2 mx-auto shadow-lg rounded-lg">
                  <div className="flex justify-center">
                    <img
                        src={user.profilePic}
                        alt={`${user.realname}'s Avatar`}
                        className="w-24 h-24 rounded-full"
                    />
                  </div>
                  <h1 className="text-2xl font-bold text-center mt-4">{user.realname}</h1>
                  <p className="text-center text-gray-600 mt-2">@{user.realname}</p>
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
            </>
        ) : (
            <div>Loading...</div>
        )}
      </div>
  );
}

export default OtherProfilePage;
