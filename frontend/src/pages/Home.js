import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'tailwindcss/tailwind.css';
import { useNavigate, Link } from 'react-router-dom';
import Header from '../components/LoginHeader.js';
import ContentCard from '../components/ContentCard.js';

function HomePage() {
  const [loadedPosts, setLoadedPosts] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();

  const user = {
    username: localStorage.getItem('username'),
    realname: localStorage.getItem('realname'),
    avatar: localStorage.getItem('profilePic'),
  };

  const handleLogout = () => {
    console.log('User logged out');
    navigate('/logout');
  };

  useEffect(() => {
    const sessionId = localStorage.getItem('sessionToken');
    if (!sessionId) {
      navigate('/');
    }
  }, []);

  const handleUpvote = async (postId) => {
    try {
      const response = await axios.post(
          `http://localhost:3001/post/${postId}/upvote`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
            },
            timeout: 5000,
          }
      );

      setLoadedPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? response.data.post : post))
      );
      setRefresh(!refresh)
    } catch (error) {
      console.error('Error upvoting post:', error);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const response = await axios.post(
          `http://localhost:3001/post/${postId}/downvote`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
            },
            timeout: 5000,
          }
      );

      setLoadedPosts((prevPosts) =>
          prevPosts.map((post) => (post._id === postId ? response.data.post : post))
      );
      setRefresh(!refresh);
    } catch (error) {
      console.error('Error downvoting post:', error);
    }
  };


  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log(localStorage.getItem('sessionToken'))
        const response = await axios.get('http://localhost:3001/postsGet', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
          },
        });

        setLoadedPosts(response.data.posts);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPosts();
  }, [refresh]);

  return (
      <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
        <Header user={user} onLogout={handleLogout} />
        <div className="h-20"></div>
        {loadedPosts.map((post, index) => (
            <ContentCard
                key={index}
                username={post.poster.username}
                content={post.postText}
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                postId={post._id}
                timePosted={post.createdAt}
                profileLink={post.poster.profilePic}
                onUpvote={() => handleUpvote(post._id)}
                onDownvote={() => handleDownvote(post._id)}
            />
        ))}

        <div className="fixed bottom-4 right-4">
          <Link to="/newpost" className="bg-blue-500 text-white p-2 rounded-full">
            New Post
          </Link>
        </div>
      </div>
  );
}

export default HomePage;