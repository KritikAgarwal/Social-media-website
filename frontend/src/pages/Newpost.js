import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/LoginHeader';
import axios from 'axios';

function NewPostPage() {
    const [postContent, setPostContent] = useState('');
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

    const handlePostSubmit = async () => {
        try {
            const token = localStorage.getItem('sessionToken');

            const response = await axios.post(
                'http://localhost:3001/postCreate',
                { post: postContent },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log('Post submitted:', postContent);
            console.log('Server response:', response.data);

            navigate('/home');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
            <Header user={user} onLogout={handleLogout} />

            <div className="w-full max-w-md p-4 bg-white rounded-md shadow-md">
                <textarea
                    className="w-full h-40 p-4 border border-gray-300 rounded-md mb-4"
                    placeholder="What's on your mind?"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                ></textarea>

                <div className="flex justify-between">
                    <Link to="/home" className="text-blue-500">
                        Cancel
                    </Link>
                    <button
                        onClick={handlePostSubmit}
                        className="bg-blue-500 text-white px-4 py-2 rounded-full"
                    >
                        Post
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NewPostPage;