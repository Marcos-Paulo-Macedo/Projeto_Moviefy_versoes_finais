import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { buscarFilmesPorNome } from '../api/pesquisa';
import Logo from '../images/Cinemax.png';
import PopCorn from '../images/pop-corn.png';

import './pesquisa.css';

const Pesquisa = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const location = useLocation();
  const query = new URLSearchParams(location.search).get('query');
  const navigate = useNavigate(); // Hook para navegação

  const searchMovies = async (query) => {
    if (!query) return;
    try {
      const filmes = await buscarFilmesPorNome(query);
      console.log('Filmes encontrados:', filmes);
      setMovies(filmes);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      setError('Erro ao buscar filmes');
      setLoading(false);
    }
  };

  useEffect(() => {
    if (query) {
      searchMovies(query);
    }
  }, [query]);

  // Função para voltar para a tela inicial (Home)
  const handleBackToHome = () => {
    navigate('/'); // Redireciona para a home
  };

  if (loading) {
    return <div className="loader"></div>
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="movie-list-container">
      <div className="header">
        <img src={Logo} className="logo" alt="Logo" />
        <h2>Pesquisa: {query}</h2>
        <button className="back-home-btn" onClick={handleBackToHome}>
          Voltar para a Home
        </button>
      </div>

      <div className="movies-grid">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <Link to={`/movie/${movie.id}`} className="movie-link">
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-image"
                />
                <h2>{movie.title}</h2>
              </Link>
              <p>{movie.release_date}</p>
              <div className="movie-info">
                <img src={PopCorn} alt="Pipoca" className="popcorn" />
                <span>{movie.vote_average}/10</span>
              </div>
            </div>
          ))
        ) : (
          <p>Nenhum filme encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default Pesquisa;
