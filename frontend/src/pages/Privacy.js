import React from 'react';
import Footer from "../components/Footer";
import 'tailwindcss/tailwind.css';
import Header from "../components/Header";

function PrivacyPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <header className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-center p-8">
                <h1 className="text-4xl font-extrabold mb-4">Privacy Policy</h1>
                <p className="text-lg mb-8">
                    Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
                </p>
            </header>
            <section className="p-6 flex-1">
                <h2 className="text-2xl font-semibold mb-4">Data Collection</h2>
                <p>
                    We may collect personal information when you use our website or services. This information is used for specific purposes and is kept secure and confidential.
                </p>

                <h2 className="text-2xl font-semibold mb-4">Data Usage</h2>
                <p>
                    The collected data is used to improve our services and enhance your experience on our website. We do not share your personal information with third parties without your explicit consent.
                </p>

                <h2 className="text-2xl font-semibold mb-4">Security Measures</h2>
                <p>
                    We take stringent measures to ensure the security of your data. Our systems are equipped with the latest encryption technologies to safeguard your information from unauthorized access.
                </p>
            </section>
            <Footer />
        </div>
    );
}

export default PrivacyPage;
