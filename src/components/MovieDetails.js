import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './MovieDetails.css'; // Import your CSS file

function MovieDetails() {
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams(); // Get movie ID from URL params

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        //search in api by id as OMDB supports only by ID AND TITLE SEARCHES
        const response = await axios.get(`http://www.omdbapi.com/?i=${id}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
        if (response.data.Response === 'True') {
          setMovie(response.data);
        } else {
          setError(response.data.Error);
        }
      } catch (error) {
        setError('An error occurred. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p className="error">Error: {error}</p>;
  if (!movie) return null;

  return (
    // content to be displayed on movie details page
    <div className="movie-details">
      <h2>{movie.Title}</h2>
      <div className="movie-info">
        <img src={movie.Poster} alt={movie.Title} />
        <div className="details">
          <p><strong>Year:</strong> {movie.Year}</p>
          <p><strong>Rated:</strong> {movie.Rated}</p>
          <p><strong>Runtime:</strong> {movie.Runtime}</p>
          <p><strong>Genre:</strong> {movie.Genre}</p>
          <p><strong>Director:</strong> {movie.Director}</p>
          <p><strong>Writer:</strong> {movie.Writer}</p>
          <p><strong>Actors:</strong> {movie.Actors}</p>
          <p><strong>Plot:</strong> {movie.Plot}</p>
          <p><strong>Language:</strong> {movie.Language}</p>
          <p><strong>Country:</strong> {movie.Country}</p>
          <p><strong>Awards:</strong> {movie.Awards}</p>
          <p><strong>IMDB Rating:</strong> {movie.imdbRating}</p>
          <p><strong>Rotten Tomatoes:</strong> {movie.Ratings.find(rating => rating.Source === 'Rotten Tomatoes')?.Value}</p>
          <p><strong>Metacritic:</strong> {movie.Ratings.find(rating => rating.Source === 'Metacritic')?.Value}</p>
          <p><strong>Box Office:</strong> {movie.BoxOffice}</p>
          <p><strong>Production:</strong> {movie.Production}</p>
          <p><strong>Website:</strong> <a href={movie.Website}>{movie.Website}</a></p>
          {/* Add more details as needed */}
        </div>
      </div>
    </div>
  );
}

export default MovieDetails;
