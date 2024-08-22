import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import TinderCard from 'react-tinder-card';
import api from '../api'; // Assuming you have an api.js file for axios instance
import "../styles/TinderUI.css"

function Recommendations() {
    const { movieId } = useParams();
    const [recommendations, setRecommendations] = useState([]);
    const [currentMovie, setCurrentMovie] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.post('/api/recommendations/', { movie_id: movieId });
                setRecommendations(response.data.results);
                setCurrentMovie(response.data.results[0]); // Set the first movie as the current movie
            } catch (error) {
                alert('Failed to fetch recommendations');
            }
        };

        fetchRecommendations();
    }, [movieId]);

    const swiped = (direction, movieId) => {
        console.log(`Swiped ${direction} on movie ${movieId}`);
        // Handle swipe logic here (e.g., save to favorites if swiped right)
    };
    
    const outOfFrame = (movieId) => {
        console.log(`Movie ${movieId} left the screen`);
        // Update the current movie to the next one in the list
        const nextMovie = recommendations.find(movie => movie.id !== movieId);
        setCurrentMovie(nextMovie);
    };
    
    
    return (
        <div className="recommendations-container">
            <div className="tinder-cards">
                {recommendations.map((movie) => (
                    <TinderCard
                        key={movie.id}
                        onSwipe={(dir) => swiped(dir, movie.id)}
                        onCardLeftScreen={() => outOfFrame(movie.id)}
                        preventSwipe={['up', 'down']}
                    >
                        <div className="movie-card">
                            <div className="movie-details">
                                <img
                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                    alt={movie.title}
                                />
                                <h2>{movie.title}</h2>
                            </div>
                            <div className="movie-description">
                                <p>Rating: {movie.vote_average}</p>
                                <p>{movie.overview}</p>
                            </div>
                        </div>
                    </TinderCard>
                ))}
            </div>
        </div>
    );
    }
    
    export default Recommendations;