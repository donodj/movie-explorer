import { useState } from 'react'
import './App.css'
import { useEffect } from 'react';

const OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
  }
}

function App() {
  const [currentQuery, SetCurrentQuery] = useState('')
  const [currentSort, SetCurrentSort] = useState('')
  const [currentPage, SetCurrentPage] = useState(1)
  const [maxPage, SetMaxPage] = useState(1)
  const [movieData, setMovieData] = useState({})

  useEffect(() => {
    updateMovies();
  }, [currentQuery, currentSort, currentPage])

  const updateMovies = async () => {
    try {
      let request = '';

      if (currentQuery !== '') {
        request = `/search/movie?query=${currentQuery}`;
      } else {
        request = `/discover/movie?`;
      }

      if (currentSort !== '') {
        request += `&sort_by=${currentSort}`;
      }

      request += `&include_adult=false&language=en-US&page=${currentPage}`;

      const response = await fetch('https://api.themoviedb.org/3' + request, OPTIONS);
      const data = await response.json();
      setMovieData(data);

      SetMaxPage(data.total_pages);
    }
    catch (err) {
      console.error('Error fetching movies:', err);
    }
  }

  const resetPageNums = () => {
    SetCurrentPage(1);
    SetMaxPage(1);
  }

  const handleInputChange = (event) => {
    SetCurrentQuery(event.target.value);
    resetPageNums();
  }

  const handleSelectChange = (event) => {
    SetCurrentSort(event.target.value);
    resetPageNums();
  }

  const handlePrevClicked = (event) => {
    SetCurrentPage(Math.max(currentPage - 1, 1));
  }

  const handleNextClicked = (event) => {
    SetCurrentPage(Math.min(currentPage + 1, maxPage));
  }

  return (
    <>
      <h1 className='header'>Movie Explorer</h1>
      <div className='search-container'>
        <input id='text-search' placeholder='Search for a movie...' onChange={handleInputChange}></input>
        <select id='sort-options' onChange={handleSelectChange}>
          <option value=''>Sort By</option>
          <option value='primary_release_date.asc'>Release Date (Asc)</option>
          <option value='primary_release_date.desc'>Release Date (Desc)</option>
          <option value='vote_average.asc'>Rating (Asc)</option>
          <option value='vote_average.desc'>Rating (Desc)</option>
        </select>
      </div>

      <div id='movie-list'>
        {movieData.results && movieData.results.map(movie => (
          <div className='movie-panel' key={movie.id}>
            <img src={'https://image.tmdb.org/t/p/original' + movie.poster_path}></img>
            <h2>{movie.title}</h2>
            <p>{'Release Date: ' + movie.release_date}</p>
            <p>{'Rating: ' + movie.vote_average}</p>
          </div>
        ))}
      </div>

      <div className='page-footer'>
        <button id='prev-button' onClick={handlePrevClicked}>Previous</button>
        <p id='page-num-txt'>{`Page ${movieData.page} of ${movieData.total_pages}`}</p>
        <button id='next-button' onClick={handleNextClicked}>Next</button>
      </div>
    </>
  )
}

export default App
