import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, Input, Select, Button, Spin, message, Modal, Tooltip } from 'antd';
import { UnorderedListOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons';
import './Homepage.css';
const { Meta } = Card;
const { Option } = Select;

function MovieSearch() {
// states for setting the query and changing it when input in search bar changes
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('');
  // for maintaining page states so that more pages can be displayed by clciking on loadmore button
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  //state for displaying loading state when fetching of data from api is taking time
  const [loading, setLoading] = useState(false);
  // state for keeping watchlist of favourite movies
  const [watchlist, setWatchlist] = useState([]);
  // opening and closing of watchlist dialog box
  const [showWatchlist, setShowWatchlist] = useState(false);

  // function for fulfilling a request for movie search using OMDB API

  const getMovieRequest = async (page = 1) => {
    setLoading(true);
    setError(null);
  
    try {
      let url;
      // if nothing is on search bar it will display movie having batman in their title
      if (query.trim() === '') {
        url = `https://www.omdbapi.com/?s=batman&type=movie&apikey=${process.env.REACT_APP_OMDB_API_KEY}&page=${page}`;
      } else {
        url = `https://www.omdbapi.com/?s=${query}&apikey=${process.env.REACT_APP_OMDB_API_KEY}&page=${page}`;
      }
  
      const response = await axios.get(url);

      //filtering of movies based on genres
  
      if (response.data.Response === 'True') {
        let filteredMovies = response.data.Search;
        if (genre.trim() !== '') {
          filteredMovies = filteredMovies.filter(movie =>
            movie.Genre.toLowerCase().includes(genre.toLowerCase())
          );
        }
        setMovies(prevMovies => [...prevMovies, ...filteredMovies]);
      } else {
        setError(response.data.Error);
      }
    } catch (error) {
      setError('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setPage(1);
    setMovies([]);
  }, [query, genre]);
  
  useEffect(() => {
    getMovieRequest(page);
    // eslint-disable-next-line
  }, [page, genre]);

  //for fetching next pages

  const fetchNextPage = () => {
    setPage(prevPage => prevPage + 1);
  };

  // adding sleceted movies to our watchlist array

  const addToWatchlist = (movie) => {
    if (!watchlist.find(item => item.imdbID === movie.imdbID)) {
      setWatchlist(prevWatchlist => [...prevWatchlist, movie]);
      message.success(`${movie.Title} added to watchlist`);
    } else {
      message.warning(`${movie.Title} is already in watchlist`);
    }
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist(prevWatchlist => prevWatchlist.filter(movie => movie.imdbID !== movieId));
    message.success('Removed from watchlist');
  };

  const toggleWatchlist = (movie) => {
    if (watchlist.find(item => item.imdbID === movie.imdbID)) {
      removeFromWatchlist(movie.imdbID);
    } else {
      addToWatchlist(movie);
    }
  };

  const openWatchlist = () => {
    setShowWatchlist(true);
  };

  const closeWatchlist = () => {
    setShowWatchlist(false);
  };

  return (
    <div style={{ 
        padding: '20px', 
        minHeight: '50vh', 
        background: `url('https://img.freepik.com/free-photo/assortment-cinema-elements-red-background-with-copy-space_23-2148457848.jpg') center/cover no-repeat`, // Inline background image style
      }}>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <img src={"https://cdn.icon-icons.com/icons2/3053/PNG/512/movie_explorer_pro_macos_bigsur_icon_189929.png"} alt="logo" height={65} />
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', margin: '10px 0', color: '#FFF' }}>Movie Explorer</h1>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies..."
          style={{ width: '300px', marginRight: '10px' }}
        />
        {/* // search based on genre */}
        <Select
          value={genre}
          onChange={(value) => setGenre(value)}
          placeholder="Select Genre"
          style={{ width: '150px' }}
        >
          <Option value="">All Genres</Option>
          <Option value="Action">Action</Option>
          <Option value="Comedy">Comedy</Option>
          <Option value="Drama">Drama</Option>
        </Select>
      </div>
      {loading && <Spin size="large" />}
      {error && <p style={{ textAlign: 'center', color: 'red' }}>{error}</p>}
      {/* card component used for every card on homepage */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {movies.map((movie) => (
          <div key={movie.imdbID} style={{ margin: '10px', textAlign: 'center' }}>
            <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <Card
                hoverable
                style={{ width: 240 }}
                cover={<img alt={movie.Title} src={movie.Poster} style={{ height: '300px' }} />}
                actions={[
                  <Tooltip title={watchlist.find(item => item.imdbID === movie.imdbID) ? 'Remove from Watchlist' : 'Add to Watchlist'}>
                    <span onClick={(e) => { e.preventDefault(); toggleWatchlist(movie); }}>
                      {watchlist.find(item => item.imdbID === movie.imdbID) ? <HeartFilled style={{ color: 'red' }} /> : <HeartOutlined />}
                    </span>
                  </Tooltip>,
                ]}
              >
                <Meta title={movie.Title} description={movie.Year} />
              </Card>
            </Link>
          </div>
        ))}
      </div>
      {/* Watchlist code and logic using MOdal*/}
      <div style={{ position: 'fixed', right: '20px', top: '50%', transform: 'translateY(-50%)', zIndex: '999' }}>
        <Button color='red' shape="circle" icon={<UnorderedListOutlined />} size="large" onClick={openWatchlist} />
      </div>
      <Modal
        title="Watchlist"
        visible={showWatchlist}
        onCancel={closeWatchlist}
        footer={null}
      >
        {watchlist.map((movie) => (
            <Link to={`/movie/${movie.imdbID}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div key={movie.imdbID} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <img src={movie.Poster} alt={movie.Title} style={{ height: '100px', marginRight: '20px' }} />
            <div>
              <p style={{ marginBottom: '5px' }}>{movie.Title}</p>
              <p style={{ color: '#888' }}>Length: {movie.Runtime}</p>
            </div>
          </div>
            </Link>
          
        ))}
      </Modal>
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button color= "black" onClick={fetchNextPage} loading={loading}>Load More</Button>
      </div>
    </div>
  );
}

export default MovieSearch;


