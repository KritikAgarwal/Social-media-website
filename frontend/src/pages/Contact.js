import React from 'react';
import Footer from "../components/Footer";
import 'tailwindcss/tailwind.css';
import Header from "../components/Header"; 


function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <header className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-center p-8">
                <h1 className="text-4xl font-extrabold mb-4">Contact Us</h1>
                <p className="text-lg mb-8">
                    We're here to assist you. Please don't hesitate to reach out with any questions, comments, or inquiries.
                </p>
            </header>
            <section className="p-6 flex-1">
                <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                <p>
                    Whether you would like to provide feedback about our service, make a suggestion about new features, or lodge a complaint, we are ready to assist you. You can reach out in the following methods:
                </p>
                <ul className="list-disc pl-6 mt-4">
                    <li>Email: contact@letskonnect.com</li>
                    <li>Phone: +1 (555) 123-4567</li>
                    <li>Address: 123 Main Street, City, Country</li>
                </ul>
            </section>
            <Footer />
        </div>
    );
}

export default ContactPage;

