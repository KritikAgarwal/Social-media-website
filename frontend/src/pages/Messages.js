import React, { useEffect, useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';
import Header from '../components/LoginHeader.js';

function MessagesPage() {
  const user = {
    username: localStorage.getItem('username'),
    realname: localStorage.getItem('realname'),
    avatar: 'https://cdn.vectorstock.com/i/preview-1x/77/30/default-avatar-profile-icon-grey-photo-placeholder-vector-17317730.jpg',
  };

  const navigate = useNavigate();
  const [newMessage, setNewMessage] = useState('');
  const [selectedChatUsername, setSelectedChatUsername] = useState(null);
  const [messages, setMessages] = useState({});
  const [users, setUsers] = useState([]);
  const [isStartingChat, setIsStartingChat] = useState(false);
  const [newChatUsername, setNewChatUsername] = useState('');


  useEffect(() => {
    const sessionId = localStorage.getItem('sessionToken');
    if (!sessionId) {
      navigate('/');
    }

    const intervalId = setInterval(() => {
      fetchMessagesAndUsers();
    }, 5000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  const fetchMessagesAndUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/messagesGet', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('sessionToken'),
        },
      });

      if (response.ok) {
        const data = await response.json();
        const receivedMessages = data.messages;

        setMessages(receivedMessages);
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessagesAndUsers();
    // Other useEffect contents remain unchanged
    // ...
  }, []);

  const handleLogout = () => {
    navigate('/logout');
  };

  const renderMessages = (chatMessages) => {
    if (!chatMessages) {
      return null;
    }

    return chatMessages.map((message) => (
        <div
            key={message._id}
            className={`mb-2 p-2 rounded-lg ${
                message.sender === user.username ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'
            }`}
            style={{ maxWidth: '50%' }}
        >
          {message.message}
        </div>
    ));
  };

  const handleUserClick = async (username) => {
    setSelectedChatUsername(username);

    const response = await fetch('http://localhost:3001/messagesGet', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('sessionToken'),
      },
    });

    if (response.ok) {
      const data = await response.json();
      const allMessages = data.messages;

      const chatMessages = allMessages.filter(
          (message) =>
              (message.senderUsername === user.username && message.receiverUsername === username) ||
              (message.senderUsername === username && message.receiverUsername === user.username)
      );

      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        newMessages[username] = chatMessages;
        return newMessages;
      });
    } else {
      console.error('Failed to fetch messages for user:', username);
    }
  };

  const handleNewMessageChange = (e) => {
    setNewMessage(e.target.value);
  };

const handleSendMessage = async () => {
  if (newMessage.trim() !== '' && selectedChatUsername) {
    const messageObject = {
      senderUsername: user.username,
      receiverUsername: selectedChatUsername,
      text: newMessage,
    };

    try {
      console.log('Sending Message...');
      const response = await fetch('http://localhost:3001/messagePost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + localStorage.getItem('sessionToken'),
        },
        body: JSON.stringify(messageObject),
      });

      if (response.ok) {
        setMessages((prevMessages) => {
          const newMessages = { ...prevMessages };
          const chatMessages = newMessages[selectedChatUsername] || [];
          newMessages[selectedChatUsername] = [...chatMessages, messageObject];
          return newMessages;
        });

        setNewMessage('');
      } else {
        console.error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSendMessage();
    }
  };

  return (
      <div className="flex flex-col h-screen bg-gray-100">
        <Header user={user} onLogout={handleLogout} />
        <div className="h-16"></div>
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-1/4 bg-gray-200 overflow-y-auto p-4 overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Messages</h2>
            <ul>
              {users.map((sidebarUser) => (
                  <li
                      key={sidebarUser.id}
                      className={`mb-4 cursor-pointer ${selectedChatUsername === sidebarUser.username ? 'bg-gray-300' : ''}`}
                      onClick={() => handleUserClick(sidebarUser.username)}
                  >
                    <div className="flex items-center">
                      <img
                          src={sidebarUser.avatar}
                          alt={`${sidebarUser.fullName}'s Avatar`}
                          className="w-10 h-10 rounded-full mr-2"
                      />
                      <div>
                        <p className="font-bold">{sidebarUser.fullName}</p>
                        <p className="text-gray-600 truncate">{sidebarUser.lastMessage}</p>
                      </div>
                    </div>
                  </li>
              ))}
            </ul>
            {users.length === 0 && !isStartingChat && (
                <div className="mb-4">
                  <button
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => setIsStartingChat(true)}
                  >
                    Start a Chat
                  </button>
                </div>
            )}
            {isStartingChat && (
                <div className="mb-4">
                  <p className="text-gray-600">Enter a username to start a chat:</p>
                  <input
                      type="text"
                      className="p-2 border border-gray-300 rounded-full"
                      placeholder="Username"
                      value={newChatUsername}
                      onChange={(e) => setNewChatUsername(e.target.value)}
                  />
                  <button
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                      onClick={() => {
                        handleUserClick(newChatUsername);
                        setIsStartingChat(false);
                        setNewChatUsername('');
                      }}
                  >
                    Start Chat
                  </button>
                </div>
            )}
          </div>
          <div className="w-3/4 flex p-4 overflow-y-auto flex-col">
            <div className="flex-grow bg-white overflow-y-auto p-4 mb-4 shadow-lg rounded-lg overflow-auto" style={{ maxHeight: '75vh' }}>
              {selectedChatUsername && renderMessages(messages[selectedChatUsername] || [])}
            </div>
            {selectedChatUsername && (
                <div className="flex p-4">
                  <input
                      type="text"
                      className="flex-1 p-2 rounded-full border border-gray-300"
                      placeholder="Type a message..."
                      value={newMessage}
                      onKeyPress={handleKeyPress}
                      onChange={handleNewMessageChange}
                  />
                  <button
                      className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full"
                      onClick={handleSendMessage}
                  >
                    Send
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default MessagesPage;