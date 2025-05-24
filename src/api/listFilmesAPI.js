// src/api/listFilmesAPI.js
import axios from 'axios'

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRlN2I2MmNmMjRkNDRjNzliZTIxMjVhNGQwM2ZlOCIsIm5iZiI6MTc0Mjk0MzE2NC4xMzQsInN1YiI6IjY3ZTMzM2JjZWM5OGJmMGEwZDc1ZmMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aZ9mlvBCiqGiX2exCjthB6cwtJdVCC13HLgEgVw4FwQ'
const BASE_URL = 'https://api.themoviedb.org/3'

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
}

export const listarFilmesPorGenero = async (genreId, page = 1) => {
  try {
    const response = await axios.get(`${BASE_URL}/discover/movie`, {
      headers,
      params: {
        with_genres: genreId,
        language: 'pt-BR',
        page: page,
      }
    })
    return {
      movies: response.data.results,
      totalPages: response.data.total_pages,
      totalResults: response.data.total_results,
    };
  } catch (error) {
    console.error('Erro ao buscar filmes por gênero:', error);
    return { movies: [], totalPages: 1, totalResults: 0 };
  }
}