import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MessageSquare } from 'react-feather';

function Header({ user, onLogout }) {
    const [isPopupVisible, setPopupVisible] = useState(false);
    
    const navigate = useNavigate();

    const togglePopup = () => {
        setPopupVisible(!isPopupVisible);
    };

    return (
        <nav className="bg-gray-800 text-white p-2 flex items-center justify-between fixed w-full top-0">
            <ul className="flex space-x-4">
                <li>
                    <a href="/home" className="tab-link">
                        <Home size={24} />
                    </a>
                </li>
            </ul>
            <div className="flex items-center space-x-4 relative">
                <img
                    src={user.avatar}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <h2 className="text-xl font-semibold">
                        <span
                            className="cursor-pointer text-white-500"
                            onClick={togglePopup}
                        >
                            {user.realname}
                        </span>
                    </h2>
                    <p className="text-gray-500">@{user.username}</p>
                </div>
                {isPopupVisible && (
                    <div className="absolute right-0 top-full mt-2 bg-white p-2 border rounded">
                        <a 
                            href="/profile"
                            className="block py-2 px-4"
                        >
                            <p className="text-black">Profile</p>
                        </a>
                        <a 
                            href="/logout" 
                            className="block py-2 px-4" 
                            onClick={onLogout}
                        >
                            <p className="text-black">Logout</p>
                        </a>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Header;
