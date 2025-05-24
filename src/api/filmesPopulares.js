const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRlN2I2MmNmMjRkNDRjNzliZTIxMjVhNGQwM2ZlOCIsIm5iZiI6MTc0Mjk0MzE2NC4xMzQsInN1YiI6IjY3ZTMzM2JjZWM5OGJmMGEwZDc1ZmMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aZ9mlvBCiqGiX2exCjthB6cwtJdVCC13HLgEgVw4FwQ';

const getFilmesPopulares = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1`,
      {
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Erro ao buscar filmes populares: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes populares:', error);
    return [];
  }
};

export default getFilmesPopulares;
