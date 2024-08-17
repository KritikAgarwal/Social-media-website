import React from 'react';
import { Link } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

function NotFound() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500 justify-center items-center">
            <h1 className="text-4xl font-bold mb-4">404</h1>
            <p className="text-xl mb-4">Oops! The page you are looking for does not exist.</p>
            <Link to="/" className="px-4 py-2 bg-blue-500 text-white rounded">Go Back Home</Link>
        </div>
    );
}

export default NotFound;