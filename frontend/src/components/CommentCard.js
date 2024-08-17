import React from 'react';

const CommentCard = ({ username, comment }) => {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md w-full mx-auto mb-4">
            <div className="flex items-center mb-2">
                <div className="text-blue-500 font-semibold">{username}</div>
            </div>
            <div className="text-gray-500">{comment}</div>
        </div>
    );
};

export default CommentCard;