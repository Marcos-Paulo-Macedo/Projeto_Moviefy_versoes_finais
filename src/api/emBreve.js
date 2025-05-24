const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRlN2I2MmNmMjRkNDRjNzliZTIxMjVhNGQwM2ZlOCIsIm5iZiI6MTc0Mjk0MzE2NC4xMzQsInN1YiI6IjY3ZTMzM2JjZWM5OGJmMGEwZDc1ZmMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aZ9mlvBCiqGiX2exCjthB6cwtJdVCC13HLgEgVw4FwQ';
const BASE_URL = 'https://api.themoviedb.org/3';

export const buscarFilmesEmBreve = async () => {
  try {
    const response = await fetch(`${BASE_URL}/movie/upcoming?language=pt-BR&page=1`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,  // Utilize Bearer Token no header
      },
    });

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes em breve:', error);
    throw error;
  }
};
