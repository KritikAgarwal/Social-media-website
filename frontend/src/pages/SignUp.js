import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';
import { useNavigate } from 'react-router-dom';

function SignupPage() {
    const [username, setUsername] = useState('');
    const [realname, setRealName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert('Password and Confirm Password do not match');
            return;
        }

        try {
            console.log('s')
            // TODO: Hash the password before sending it to the server
            const userData = { username, password, realname, profilePicture };

            const response = await registerUser(userData);
            console.log(response.status);

            if (response.status === 201) {
                navigate('/login');
            } else if (response.status === 400) {
                alert('User already exists')
            } else {
                console.log('Registration failed!');
            }
        } catch (error) {
            console.error('Registration error:', error);
        }
    };

    const registerUser = async (userData) => {
        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            console.log('Response Status:', response.status);
            if (response.status === 201) {
                const data = await response.json();
                console.log('User registered:', data.sessionId);
            } else {
                console.error('Registration failed');
            }

            return response;
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Sign Up</h2>
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        className="mt-1 p-2 block w-full rounded border border-gray-300"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="realname" className="block text-sm font-medium text-gray-600">
                        Real Name
                    </label>
                    <input
                        type="text"
                        id="realname"
                        className="mt-1 p-2 block w-full rounded border border-gray-300"
                        value={realname}
                        onChange={(e) => setRealName(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        className="mt-1 p-2 block w-full rounded border border-gray-300"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-600">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        className="mt-1 p-2 block w-full rounded border border-gray-300"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-600">
                        Profile Picture Link
                    </label>
                    <input
                        type="text"
                        id="realname"
                        className="mt-1 p-2 block w-full rounded border border-gray-300"
                        value={profilePicture}
                        onChange={(e) => setProfilePicture(e.target.value)}
                    />
                </div>
                <button
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    onClick={handleSignup}
                >
                    Sign Up
                </button>
                <p className="text-gray-600 mt-4 text-center">
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    );
}

export default SignupPage;
