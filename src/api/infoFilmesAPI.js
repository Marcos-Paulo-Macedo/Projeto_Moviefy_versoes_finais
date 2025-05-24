import axios from 'axios'

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRlN2I2MmNmMjRkNDRjNzliZTIxMjVhNGQwM2ZlOCIsIm5iZiI6MTc0Mjk0MzE2NC4xMzQsInN1YiI6IjY3ZTMzM2JjZWM5OGJmMGEwZDc1ZmMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aZ9mlvBCiqGiX2exCjthB6cwtJdVCC13HLgEgVw4FwQ'

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
}

// Detalhes do Filme
export const getMovieDetails = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}?language=pt-BR`
  const response = await axios.get(url, { headers })
  return response.data
}

// Trailer do Filme
export const getTrailerUrl = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/videos?language=pt-BR`
  const response = await axios.get(url, { headers })
  const videos = response.data.results
  const trailer = videos.find((v) => v.site === 'YouTube')
  return trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
}

// Avaliações e Reviews
export const getReviews = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=pt-BR`
  const response = await axios.get(url, { headers })
  return response.data.results
}

// IDs Externos (IMDb, redes sociais)
export const getExternalIds = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/external_ids`
  const response = await axios.get(url, { headers })
  return response.data
}

// Imagens Extras (posters, backdrops)
export const getImages = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/images`
  const response = await axios.get(url, { headers })
  return response.data
}

// Provedores de Streaming
export const getWatchProviders = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/watch/providers`
  const response = await axios.get(url, { headers })
  return response.data.results?.BR || {}
}

// Traduções e Localização
export const getTranslations = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/translations`
  const response = await axios.get(url, { headers })
  return response.data.translations
}

// Filmes por Ator ou Diretor
export const getPersonMovieCredits = async (personId) => {
  const url = `https://api.themoviedb.org/3/person/${personId}/movie_credits?language=pt-BR`
  const response = await axios.get(url, { headers })
  return response.data
}

//Filmes Recomendados
export const getRecommendations = async (movieId) => {
  const url = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?language=pt-BR`
  const response = await axios.get(url, { headers })
  return response.data.results
}