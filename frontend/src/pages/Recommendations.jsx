import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api'; // Assuming you have an api.js file for axios instance

function Recommendations() {
    const { movieId } = useParams();
    const [recommendations, setRecommendations] = useState(null);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await api.post('/api/recommendations/', { movie_id: movieId });
                setRecommendations(response.data);
            } catch (error) {
                alert('Failed to fetch recommendations');
            }
        };

        fetchRecommendations();
    }, [movieId]);

    return (
        <div>
            <h1>Recommendations</h1>
            {recommendations && (
                <div className="recommendations">
                    {recommendations.results.map((movie) => (
                        <div key={movie.id} className="movie">
                            <img
                                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                alt={movie.title}
                            />
                            <p>{movie.title}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Recommendations;