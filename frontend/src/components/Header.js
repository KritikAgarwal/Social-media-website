import React from 'react';
import 'tailwindcss/tailwind.css';

function Header() {
    return (
        <header className="bg-blue-900 text-white py-4">
            <div className="container mx-auto">
                <h1 className="text-4xl font-extrabold">Konnect</h1>
            </div>
        </header>
    );
}

export default Header;