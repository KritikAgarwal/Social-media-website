import React from 'react';
import 'tailwindcss/tailwind.css';

function Footer() {
    return (
        <footer className="bg-gray-800 text-white text-center p-4">
            <div className="mb-4">
                <a href="/" className="text-gray-400 hover:text-white mx-2">
                    Home
                </a>
                <a href="/about" className="text-gray-400 hover:text-white mx-2">
                    About
                </a>
                <a href="/privacy" className="text-gray-400 hover:text-white mx-2">
                    Privacy
                </a>
                <a href="/contact" className="text-gray-400 hover:text-white mx-2">
                    Contact
                </a>
            </div>
            <p>&copy; 2023 Konnect, Inc. All rights reserved.</p>
        </footer>
    );
}

export default Footer;