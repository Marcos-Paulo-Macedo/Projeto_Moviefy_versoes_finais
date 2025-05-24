const API_KEY = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRlN2I2MmNmMjRkNDRjNzliZTIxMjVhNGQwM2ZlOCIsIm5iZiI6MTc0Mjk0MzE2NC4xMzQsInN1YiI6IjY3ZTMzM2JjZWM5OGJmMGEwZDc1ZmMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aZ9mlvBCiqGiX2exCjthB6cwtJdVCC13HLgEgVw4FwQ';
const API_URL = 'https://api.themoviedb.org/3/discover/movie';

export const buscarFilmesMaisBemAvaliados = async () => {
  const hoje = new Date();
  const anoPassado = new Date();
  anoPassado.setFullYear(hoje.getFullYear() - 1);

  const dataInicio = anoPassado.toISOString().split('T')[0]; // formato: yyyy-mm-dd
  const dataFim = hoje.toISOString().split('T')[0];

  const url = `${API_URL}?language=pt-BR&sort_by=vote_average.desc&vote_count.gte=100&primary_release_date.gte=${dataInicio}&primary_release_date.lte=${dataFim}&page=1`;

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${API_KEY}`
    }
  };

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error('Erro ao buscar filmes');
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Erro ao buscar filmes mais bem avaliados:', error);
    throw error;
  }
};
