// src/api/listagemAleatóriaFilmesAPI.js
import axios from 'axios'

const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRlN2I2MmNmMjRkNDRjNzliZTIxMjVhNGQwM2ZlOCIsIm5iZiI6MTc0Mjk0MzE2NC4xMzQsInN1YiI6IjY3ZTMzM2JjZWM5OGJmMGEwZDc1ZmMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aZ9mlvBCiqGiX2exCjthB6cwtJdVCC13HLgEgVw4FwQ'
const BASE_URL = 'https://api.themoviedb.org/3'

const headers = {
  accept: 'application/json',
  Authorization: `Bearer ${API_KEY}`,
}

export const buscarFilmesPopularesAleatorios = async () => {
  try {
    const paginaAleatoria = Math.floor(Math.random() * 30) + 1 // de 1 a 30
    const response = await axios.get(`${BASE_URL}/movie/popular`, {
      headers,
      params: {
        language: 'en-US',
        page: paginaAleatoria
      }
    })

    return response.data.results
  } catch (error) {
    console.error('Erro ao buscar filmes populares aleatórios:', error)
    return []
  }
}
