import { React, useState } from 'react';
import Footer from "../components/Footer";
import 'tailwindcss/tailwind.css';
import Header from "../components/Header";
function AboutPage() {
    const [faqs] = useState([
        { question: 'What is our mission?', answer: 'Our mission is to provide a platform to improve the social lives of university students by providing them a platform to connect, make friends, and plan events.' },
        { question: 'Who were the two people who started this platform?', answer: 'This site was started by Kanishka Sahoo and Kritik Agarwal'},
        { question: 'What are our core values?', answer: 'Our core values include integrity, privacy, and security.' },
    ]);

    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(index === activeIndex ? null : index);
    };
    

    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <header className="bg-gradient-to-r from-blue-400 to-purple-500 text-white text-center p-8">
                <h1 className="text-4xl font-extrabold mb-4">About Us</h1>
            </header>
            <section className="p-6 flex-1">
                <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
                <p>
                    Established in 2023, we started as a group of 2 people who wanted to build a platform for people to connect, share ideas, and inspire each other to do great things.
                    We started with a simple idea of connecting people and have grown into a platform that is used by millions of people every day.
                </p>
                <h2 className="text-2xl font-semibold mt-8 mb-4">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div key={index}>
                            <button
                                className="text-left w-full p-2 font-semibold bg-gray-100 hover:bg-gray-200"
                                onClick={() => toggleFAQ(index)}
                            >
                                {faq.question}
                            </button>
                            {activeIndex === index && (
                                <p className="pl-2">{faq.answer}</p>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <Footer />
        </div>
    );
}

export default AboutPage;
