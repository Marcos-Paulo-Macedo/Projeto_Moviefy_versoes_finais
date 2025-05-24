import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { listarFilmesPorGenero } from '../api/listFilmesAPI'
import './movieLista.css'

function MovieList() {
  const { genreId } = useParams()
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const fetchMovies = async (page) => {
    setLoading(true)
    const { movies, totalPages } = await listarFilmesPorGenero(genreId, page)
    setMovies(movies)
    setTotalPages(totalPages)
    setLoading(false)
  }

  useEffect(() => {
    fetchMovies(currentPage)
  }, [genreId, currentPage])

  return (
    <div className="movie-list-container">
      <h1>Filmes de Gênero</h1>
      <Link to="/" className="back-home-btn">Voltar para Home</Link>

      {loading ? (
        <p className="loader"></p>
      ) : (
        <div className="movies-grid">
          {movies.length > 0 ? (
            movies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <Link to={`/movie/${movie.id}`} className="movie-link">
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="movie-poster"
                  />
                  <h3>{movie.title}</h3>
                  <p>Nota: {movie.vote_average}</p>
                </Link>
              </div>
            ))
          ) : (
            <p>Sem filmes para exibir.</p>
          )}
        </div>
      )}

      {/* Paginação */}
      <div className="pagination">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(prev => prev - 1)}
          className="page-btn"
        >
          Anterior
        </button>
        <span>Página {currentPage} de {totalPages}</span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(prev => prev + 1)}
          className="page-btn"
        >
          Próxima
        </button>
      </div>
    </div>
  )
}

export default MovieList
