import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ContentCard from '../components/ContentCard';
import Header from '../components/LoginHeader';
import CommentCard from "../components/CommentCard";
import axios from 'axios';

const PostView = () => {
    const [post, setPost] = useState(null);
    const {id: postId} = useParams();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [refresh, setRefresh] = useState(false);
    const navigate = useNavigate();
    const user = {
        username: localStorage.getItem('username'),
        realname: localStorage.getItem('realname'),
        avatar: localStorage.getItem('profilePic'),
    };
    const handleUpvote = async (postId) => {
        try {
            await axios.post(
                `http://localhost:3001/post/${post._id}/upvote`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
                    },
                    timeout: 5000,
                }
            );

            setRefresh(!refresh)
        } catch (error) {
            console.error('Error upvoting post:', error);
        }
    };

    const handleDownvote = async (postId) => {
        try {
            await axios.post(
                `http://localhost:3001/post/${post._id}/downvote`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
                    },
                    timeout: 5000,
                }
            );

            setRefresh(!refresh);
        } catch (error) {
            console.error('Error downvoting post:', error);
        }
    };

    useEffect(() => {
        const sessionId = localStorage.getItem('sessionToken');
        if (!sessionId) {
            navigate('/');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPostData = async () => {
            try {
                if (!/^[0-9a-fA-F]{24}$/.test(postId)) {
                    console.error('Invalid postId format');
                    return;
                }

                const response = await axios.get(`http://localhost:3001/postGet/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
                    },
                });

                setPost(response.data.post);

                const commentsResponse = await axios.get(`http://localhost:3001/post/${postId}/comments`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
                    },
                });
                setComments(commentsResponse.data.comments);
            } catch (error) {
                console.error('Error fetching post data:', error);
            }
        };

        fetchPostData();
    }, [postId, refresh]);
    const handleNewComment = async (event) => {
        event.preventDefault();
        try {
            await axios.post(
                `http://localhost:3001/post/${postId}/comment`,
                {comment: newComment},
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
                    },
                }
            );
            setNewComment('');
            setRefresh(!refresh);
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };
    if (!post) {
        return <div>Loading...</div>;
    }

    const handleLogout = () => {
        console.log('User logged out');
        navigate('/logout');
    };
    console.log(post.comments.length)
    return (
        <div className="flex flex-col items-center bg-gray-50">
            <Header user={user} onLogout={handleLogout}/>
            <div className="h-20"></div>
            <ContentCard
                content={post.postText}
                upvotes={post.upvotes}
                downvotes={post.downvotes}
                comments={post.comments ? post.comments.length : 0}
                postId={post._id}
                username={post.poster ? post.poster.username : 'Unknown User'}
                profileLink={post.poster.profilePic}
                timePosted={post.createdAt}
                onUpvote={handleUpvote}
                onDownvote={handleDownvote}
            />

            <div className="bg-gray-100 p-4 rounded-lg shadow-md w-1/2 mx-auto mb-4">
                <h2 className="text-xl font-semibold mb-4">Comments</h2>
                <form onSubmit={handleNewComment}>
                    <input
                        type="text"
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Add a comment"
                    />
                    <button type="submit">Submit</button>
                </form>
                <div className="h-4"></div>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <CommentCard key={index} username={comment.sender.username} comment={comment.comment}/>
                    ))
                ) : (
                    <div className="text-gray-500">No comments yet.</div>
                )}

            </div>
        </div>
    );
}

export default PostView;