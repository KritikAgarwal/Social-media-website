import React, {useEffect, useState} from 'react';
import { ArrowUp, ArrowDown, MessageCircle } from 'react-feather';
import { Link } from 'react-router-dom';
import axios from "axios";

const ContentCard = ({
                       username,
                       content,
                       upvotes,
                       downvotes,
                       postId,
                       timePosted,
                       profileLink,
                       onUpvote,
                       onDownvote
                     }) => {
  const [comments, setComments] = useState([]);

    useEffect(() => {
        const getCommentCount = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/commentsGet/${postId}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('sessionToken')}`,
                    },
                });
                setComments(response.data.comments);
                console.log(comments)
            } catch (error) {
                console.error(error);
            }
        };

        getCommentCount();
    }, [comments, postId]);

  const getShortFormTime = (timestamp) => {
    const postDate = new Date(timestamp);
    const currentTime = new Date();
    const timeDifference = Math.floor((currentTime - postDate) / 1000);

    if (timeDifference < 60) {
      return `${timeDifference} second${timeDifference !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < 3600) {
      const minutesAgo = Math.floor(timeDifference / 60);
      return `${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < 86400) {
      const hoursAgo = Math.floor(timeDifference / 3600);
      return `${hoursAgo} hour${hoursAgo !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < 604800) {
      const daysAgo = Math.floor(timeDifference / 86400);
      return `${daysAgo} day${daysAgo !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < 2419200) {
      const weeksAgo = Math.floor(timeDifference / 604800);
      return `${weeksAgo} week${weeksAgo !== 1 ? 's' : ''} ago`;
    } else if (timeDifference < 29030400) {
      const monthsAgo = Math.floor(timeDifference / 2419200);
      return `${monthsAgo} month${monthsAgo !== 1 ? 's' : ''} ago`;
    } else {
      const yearsAgo = Math.floor(timeDifference / 29030400);
      return `${yearsAgo} year${yearsAgo !== 1 ? 's' : ''} ago`;
    }
  };

  const shortFormTime = getShortFormTime(timePosted);
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-1/2 mx-auto mb-4">
            <div className="flex items-start">
                <div className="mr-4">
                    <img
                        src={profileLink}
                        alt={`${username}'s Profile`}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                </div>
                <div className="flex-grow">
                    <div className="flex justify-between items-center mb-2">
                        <Link to={`/profile/${username}`} className="text-blue-500 font-semibold hover:underline">
                            {username}
                        </Link>
                        <span className="text-gray-500 text-sm">{shortFormTime}</span>
                    </div>
                    <p className="text-gray-800 break-words">{content}</p>
                </div>
            </div>

            <div className="flex justify-between items-center mt-3">
                <div className="flex items-center">
                    <button className="flex items-center text-blue-500 hover:text-blue-700 mr-2" onClick={onUpvote}>
                        <ArrowUp size={18} className="mr-1" />
                        {upvotes.length}
                    </button>
                    <button className="flex items-center text-red-500 hover:text-red-700" onClick={onDownvote}>
                        <ArrowDown size={18} className="mr-1" />
                        {downvotes.length}
                    </button>
                </div>
                <Link to={`/post/${postId}`} className="flex items-center text-gray-500 hover:text-gray-700">
                    <MessageCircle size={18} className="mr-1" />
                    {comments}
                </Link>
            </div>
        </div>
    );
};

export default ContentCard;
