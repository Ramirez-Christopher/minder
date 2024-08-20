import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../styles/Forms.css"
import LoadingIndicator from "./LoadingIndicator";

function Form({ route, method }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const name = method === "login" ? "Login" : "Register";

    // Function to handle form submission
    const handleSubmit = async (e) => {
        setLoading(true); // Set loading state to true

        e.preventDefault(); // Prevent default form submission behavior

        try {
            // Make API request to the specified route with username and password
            const res = await api.post(route, { username, password });

            if (method === "login") {
                // If the method is login, store access and refresh tokens in local storage
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
                navigate("/"); // Navigate to home page
            } else {
                navigate("/login"); // Navigate to login page
            }
        } catch (error) {
            alert(error); // Display error message
        } finally { 
            setLoading(false); // Set loading state to false
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-container">
            <h1>{name}</h1>
            <input
                className="form-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
            />
            <input
                className="form-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            {loading && <LoadingIndicator />}
            <button className="form-button" type="submit">
                {name}
            </button>
        </form>
    );
}

export default Form