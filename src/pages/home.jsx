import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { buscarFilmesPopularesAleatorios } from '../api/listagemAleatóriaFilmesAPI';
import { buscarFilmesPorNome } from '../api/pesquisa';
import getFilmesPopulares from '../api/filmesPopulares';
import traduzirTexto from '../api/traduzir';
import { buscarFilmesEmBreve } from '../api/emBreve'; 
import { buscarFilmesMaisBemAvaliados } from '../api/maisBemAvaliados';

import './home.css';
import Logo from '../images/Cinemax.png';
import PopCorn from '../images/pop-corn.png';

const categories = [
  { id: 28, name: 'Ação' },
  { id: 35, name: 'Comédia' },
  { id: 27, name: 'Terror' },
  { id: 18, name: 'Drama' },
  { id: 53, name: 'Suspense' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Ficção Científica' },
  { id: 12, name: 'Aventura' },
  { id: 14, name: 'Fantasia' },
  { id: 16, name: 'Animação' },
  { id: 10751, name: 'Familia' },
  { id: 80, name: 'Crime' },
  { id: 10402, name: 'Musica' },
  { id: 9648, name: 'Misterio' }
];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [currentMovies, setCurrentMovies] = useState([]);
  const [topFilmes, setTopFilmes] = useState([]);
  const [filmesEmBreve, setFilmesEmBreve] = useState([]);
  const [filmesMaisBemAvaliados, setFilmesMaisBemAvaliados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const fetchMovies = async () => {
    try {
      const filmes = await buscarFilmesPopularesAleatorios();
      setMovies(filmes);
      setError(null);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      setError('Erro ao buscar filmes');
      setLoading(false);
    }
  };

  const getRandomMovies = () => {
    if (movies.length > 0) {
      const shuffled = [...movies].sort(() => 0.5 - Math.random());
      const selectedMovies = shuffled.slice(0, 3);
      setCurrentMovies(selectedMovies);
    }
  };

  const searchMovies = async () => {
    if (searchQuery.trim() === '') return;

    try {
      const filmes = await buscarFilmesPorNome(searchQuery);
      setMovies(filmes);
      navigate(`/pesquisa?query=${encodeURIComponent(searchQuery)}`);
    } catch (error) {
      console.error('Erro ao buscar filmes:', error);
      setError('Erro ao buscar filmes');
    }
  };

  useEffect(() => {
    fetchMovies();

    const interval = setInterval(() => {
      getRandomMovies();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      getRandomMovies();
    }
  }, [movies]);

  useEffect(() => {
    async function fetchTopFilmes() {
      try {
        const filmes = await getFilmesPopulares();
        setTopFilmes(filmes.slice(0, 4));
      } catch (error) {
        console.error('Erro ao buscar top filmes:', error);
      }
    }

    async function fetchFilmesEmBreve() {
      try {
        const filmes = await buscarFilmesEmBreve();
        setFilmesEmBreve(filmes.slice(0, 4)); // Limita para 4 filmes
      } catch (error) {
        console.error('Erro ao buscar filmes em breve:', error);
      }
    }

    async function fetchFilmesMaisBemAvaliados() {
      try {
        const filmes = await buscarFilmesMaisBemAvaliados();
        setFilmesMaisBemAvaliados(filmes.slice(0, 4)); // Limita para 4 filmes
      } catch (error) {
        console.error('Erro ao buscar filmes mais bem avaliados:', error);
      }
    }

    fetchTopFilmes();
    fetchFilmesEmBreve();
    fetchFilmesMaisBemAvaliados();
  }, []);

  if (loading) {
    return <div className="loader"></div>
  }

  if (error) {
    return <div className="error-container"><p>{error}</p></div>;
  }

  const coresCategorias = [
    '#FF0000', '#1F73BC', '#2B6328',
    '#B58121', '#731F49', '#5AAEBF'
  ];

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="header">
          <img src={Logo} className="logo" alt="Logo" />
          <h2>Movify</h2>
          <div className="menu-actions">
            <button className="profile-btn" onClick={() => navigate('/perfil')}>Perfil</button>
            <button className="logout-btn" onClick={() => {
              localStorage.removeItem('user');
              navigate('/login');
            }}>Sair</button>
          </div>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Pesquisar por nome do filme"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button onClick={searchMovies}>Pesquisar</button>
        </div>

        <div className="explorar">
          <h4>Categorias</h4>
          <div className="categories-list">
            {categories.map((category, index) => (
              <Link key={category.id} to={`/movies/${category.id}`} className="category-link">
                <button
                  style={{
                    backgroundColor: coresCategorias[index % coresCategorias.length],
                  }}
                  className="category-button"
                >
                  #{category.name}
                </button>
              </Link>
            ))}
          </div>
        </div>

        <div className="alta">
          <div className="emAlta">Top Filmes</div>
          <div className="filmes">
            {topFilmes.length > 0 ? (
              topFilmes.map((movie) => (
                <div key={movie.id}>
                  <div className="cartaz">
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="destaque-img"
                      />
                    </Link>
                  </div>
                  <div className="tools">
                    <div className="titulo">{movie.title}</div>
                    <div className="nota">
                      <img className="popcorn" src={PopCorn} alt="Pipoca" />
                      <p>{movie.vote_average}/10</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Sem filmes para exibir no momento.</p>
            )}
          </div>
        </div>

        <div className="alta">
          <div className="emAlta">Recomendados</div>
          <div className="filmes">
            {currentMovies.length > 0 ? (
              currentMovies.map((movie) => (
                <div key={movie.id}>
                  <div className="cartaz">
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="destaque-img"
                      />
                    </Link>
                  </div>
                  <div className="tools">
                    <div className="titulo">{movie.title}</div>
                    <div className="nota">
                      <img className="popcorn" src={PopCorn} alt="Pipoca" />
                      <p>{movie.vote_average}/10</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Sem filmes para exibir no momento.</p>
            )}
          </div>
        </div>

        {/* Seção "Em Breve" */}
        <div className="alta">
          <div className="emAlta">Em Breve</div>
          <div className="filmes">
            {filmesEmBreve.length > 0 ? (
              filmesEmBreve.map((movie) => (
                <div key={movie.id}>
                  <div className="cartaz">
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="destaque-img"
                      />
                    </Link>
                  </div>
                  <div className="tools">
                    <div className="titulo">{movie.title}</div>
                    <div className="nota">
                      <img className="popcorn" src={PopCorn} alt="Pipoca" />
                      <p>{movie.vote_average}/10</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Sem filmes para exibir no momento.</p>
            )}
          </div>
        </div>

        {/* Seção "Mais Bem Avaliados" */}
        <div className="alta">
          <div className="emAlta">Mais Bem Avaliados</div>
          <div className="filmes">
            {filmesMaisBemAvaliados.length > 0 ? (
              filmesMaisBemAvaliados.map((movie) => (
                <div key={movie.id}>
                  <div className="cartaz">
                    <Link to={`/movie/${movie.id}`}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="destaque-img"
                      />
                    </Link>
                  </div>
                  <div className="tools">
                    <div className="titulo">{movie.title}</div>
                    <div className="nota">
                      <img className="popcorn" src={PopCorn} alt="Pipoca" />
                      <p>{movie.vote_average}/10</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>Sem filmes para exibir no momento.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;
