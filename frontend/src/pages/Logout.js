import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function LogoutPage() {
    const countdown = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const handleLogout = async () => {
            try {
                // Call the logout endpoint
                const response = await fetch('http://localhost:3001/logout', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('sessionToken'),
                    },
                });

                if (response.status === 200) {
                    // Clear the session token from localStorage
                    localStorage.removeItem('sessionToken');
                    localStorage.removeItem('username');
                    localStorage.removeItem('realname');
                    console.log('Logout successful');
                    // Redirect to the login page
                    navigate('/')
                } else {
                    console.error('Logout failed');
                }
            } catch (error) {
                console.error('Logout error:', error);
            }
        };

        // Call the logout function when the component mounts
        handleLogout();
    }, []);

    return (
        <div>
            <h1>Logging out...</h1>
            <p>Redirecting to the home page in {countdown} seconds.</p>
            {countdown === 0 && navigate('/')}
        </div>
    );
}

export default LogoutPage;
