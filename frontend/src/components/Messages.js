import React, { useState } from 'react';

function Messages({ user, messages, message, setMessage, onSendMessage }) {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSendMessage();
        }
    };

    return (
        <div className="messages-container">
            <div className="messages-header">
                <div className="user-info">
                    <img src={user.avatar} alt={user.username} className="avatar" />
                    <div className="username">{user.username}</div>
                </div>
            </div>
            <div className="messages-list">
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.sender === user.username ? 'sent' : 'received'}`}>
                        <div className="message-sender">{msg.sender}</div>
                        <div className="message-text">{msg.text}</div>
                        <div className="message-timestamp">{msg.timestamp.toLocaleString()}</div>
                    </div>
                ))}
            </div>
            <div className="message-input">
                <input
                    type="text"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={onSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default Messages;
