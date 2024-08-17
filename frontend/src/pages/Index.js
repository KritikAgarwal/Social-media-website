import React from 'react';
import 'tailwindcss/tailwind.css';
import Footer from "../components/Footer";
import Header from "../components/Header";
function LandingPage() {
    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-r from-blue-400 to-purple-500">
            <Header />
            <div className="flex-1">
                <div className="container mx-auto p-8 text-white text-center">
                    <h2 className="text-3xl font-extrabold mb-4">Connect with the World</h2>
                    <p className="text-lg mb-8">
                        Join Konnect and stay connected with friends, family, and the world.
                    </p>
                    <a
                        href="/signup"
                        className="bg-blue-500 text-white rounded-full px-6 py-3 font-semibold hover:bg-blue-600 text-lg mr-4"
                    >
                        Sign Up
                    </a>
                    <a
                        href="/login"
                        className="border border-white text-white rounded-full px-6 py-3 font-semibold hover:bg-blue-600 text-lg"
                    >
                        Login
                    </a>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LandingPage;
