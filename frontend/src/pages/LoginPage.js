import React, { useState, useEffect } from 'react';
import 'tailwindcss/tailwind.css'; // Import Tailwind CSS
import {useNavigate} from "react-router-dom";

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const sessionId = localStorage.getItem('sessionToken');
        if (sessionId) {
            navigate('/home');
        }
    }, [navigate]);

    const handleLogin = async () => {
        try {
            // TODO: Hash the password before sending it to the server
            const loginData = { username, password: password };

            const response = await loginUser(loginData);

            if (response.status === 200) {
                const data = await response.json();
                localStorage.setItem('sessionToken', data.sessionId);
                localStorage.setItem('username',data.username);
                localStorage.setItem('realname',data.realname);
                localStorage.setItem('profilePic',data.profilePic);
                navigate('/home');
            } else {
                alert('Invalid email or password. Please try again.');
            }
        } catch (error) {
            console.error('Login error:', error);
            console.log('Login failed. Please try again.');
        }
    };

    const loginUser = async (loginData) => {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            return response;
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-400 to-purple-500">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h2 className="text-2xl font-semibold mb-4">Login</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600">
                        Email
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
                <button
                    className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
                    onClick={handleLogin}
                >
                    Login
                </button>
                <p className="text-gray-600 mt-4 text-center">
                    Don't have an account? <a href="/signup">Sign Up</a>
                </p>
            </div>
        </div>
    );
}

export default LoginPage;
