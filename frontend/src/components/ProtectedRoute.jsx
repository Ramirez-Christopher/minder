import { Navigate } from "react-router-dom"; // Import Navigate component from react-router-dom for navigation
import { jwtDecode } from "jwt-decode"; // Import jwtDecode function for decoding JWT tokens
import api from "../api"; // Import the configured Axios instance
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants"; // Import token constants
import { useState, useEffect } from "react"; // Import useState and useEffect hooks from React

// ProtectedRoute component to protect routes based on authorization
function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null); // State to track authorization status

    // useEffect hook to run the auth function on component mount
    useEffect(() => {
        auth().catch(() => setIsAuthorized(false)); // If auth fails, set isAuthorized to false
    }, []);

    // Function to refresh the access token using the refresh token
    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN); // Get the refresh token from localStorage
        try {
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken, // Send the refresh token to the API
            });
            if (res.status === 200) {
                localStorage.setItem(ACCESS_TOKEN, res.data.access); // Store the new access token in localStorage
                setIsAuthorized(true); // Set isAuthorized to true
            } else {
                setIsAuthorized(false); // If response status is not 200, set isAuthorized to false
            }
        } catch (error) {
            console.log(error); // Log any errors
            setIsAuthorized(false); // Set isAuthorized to false in case of error
        }
    };

     // Function to check the current authorization status
     const auth = async () => {
        const accessToken = localStorage.getItem(ACCESS_TOKEN); // Get the access token from localStorage
        if (!accessToken) {
            setIsAuthorized(false); // If no access token, set isAuthorized to false
            return;
        }

        try {
            const decodedToken = jwtDecode(accessToken); // Decode the access token
            const currentTime = Date.now() / 1000; // Get the current time in seconds
            if (decodedToken.exp < currentTime) {
                await refreshToken(); // If token is expired, try to refresh it
            } else {
                setIsAuthorized(true); // If token is valid, set isAuthorized to true
            }
        } catch (error) {
            console.log(error); // Log any errors
            setIsAuthorized(false); // Set isAuthorized to false in case of error
        }
    };

    // If authorization status is null, show a loading indicator
    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    // If not authorized, navigate to the login page
    if (!isAuthorized) {
        return <Navigate to="/login" />;
    }

    // If authorized, render the children components
    return children;
}

export default ProtectedRoute; // Export the ProtectedRoute component