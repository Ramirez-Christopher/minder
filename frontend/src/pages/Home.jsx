import { useState, useEffect } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [movieName, setMovieName] = useState("");
    const [movieResults, setMovieResults] = useState(null);

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api
            .get("/api/notes/")
            .then((res) => res.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((err) => alert(err));
    };

    const deleteNote = (id) => {
        api
            .delete(`/api/notes/delete/${id}/`)
            .then((res) => {
                if (res.status === 204) alert("Note deleted!");
                else alert("Failed to delete note.");
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();
        api
            .post("/api/notes/", { title, content })
            .then((res) => {
                if (res.status === 201) {
                    alert("Note created!");
                    setTitle("");
                    setContent("");
                    getNotes();
                } else {
                    alert("Failed to create note.");
                }
            })
            .catch((error) => alert(error));
    };

    const searchMovie = (e) => {
        e.preventDefault();
        api
            .post("/api/movie-search/", { movie_name: movieName })
            .then((res) => {
                setMovieResults(res.data);
            })
            .catch((error) => alert(error));
    };

    return (
        <div className="home">
            <h1>Notes</h1>
            <form onSubmit={createNote}>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title"
                    required
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content"
                    required
                />
                <button type="submit">Create Note</button>
            </form>
            <div className="notes">
                {notes.map((note) => (
                    <Note key={note.id} note={note} deleteNote={deleteNote} />
                ))}
            </div>
            <h1>Movie Search</h1>
            <form onSubmit={searchMovie}>
                <input
                    type="text"
                    value={movieName}
                    onChange={(e) => setMovieName(e.target.value)}
                    placeholder="Enter movie name"
                    required
                />
                <button type="submit">Search</button>
            </form>
            {movieResults && (
             <div>
             <h2>Search Results:</h2>
             <div className="movie-results">
                 {movieResults.results.map((movie) => (
                     <div key={movie.id} className="movie">
                         <img
                             src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                             alt={movie.title}
                         />
                         <p>{movie.title}</p>
                     </div>
                 ))}
             </div>
         </div>
     )}
        </div>
    );
}

export default Home;