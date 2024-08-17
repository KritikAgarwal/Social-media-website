import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/Index";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignUp";
import PrivacyPage from "./pages/Privacy";
import ContactPage from "./pages/Contact";
import AboutPage from "./pages/About";
import HomePage from "./pages/Home";
import LogoutPage from "./pages/Logout.js";
import ProfilePage from "./pages/Profile.js"
import MessagesPage from "./pages/Messages.js"
import Newpost from "./pages/Newpost";
import OtherProfilePage from "./pages/OtherProfile";
import PostView from "./pages/PostView";
import NotFound from "./pages/NotFound";
function App() {
    return (
        <Router>
            <Routes>
                <Route exact path='/' element={<LandingPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/signup' method="post" element={<SignupPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/contact' element={<ContactPage />} />
                <Route path='/privacy' element={<PrivacyPage />} />
                <Route path='/home' element={<HomePage />} />
                <Route path='/logout' element={<LogoutPage />} />
                <Route path='/profile' element={<ProfilePage />} />
                <Route path='/messages' element={<MessagesPage />} />
                <Route path='/newpost' element={<Newpost />} />
                <Route path='/profile/:username' element={<OtherProfilePage />} />
                <Route path='/post/:id' element={<PostView />} />
                <Route path='/404' element={<NotFound />} />
                <Route path='/*' element={<NotFound />} />
            </Routes>
        </Router>
    );
}

export default App;
