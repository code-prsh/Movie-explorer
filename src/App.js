import React from 'react';
import { BrowserRouter as Router, Route, Switch, Routes } from 'react-router-dom';
import MovieSearch from './components/Homepage';
import MovieDetails from './components/MovieDetails';



function App() {
    return (
        
      <Router>
        <Routes>
          <Route path="/" element={<MovieSearch />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </Router>
    );
  }
export default App;
