import axios from 'axios';

const LIBRETRANSLATE_URL = 'https://libretranslate.de/translate'; // URL da API pública

// Função para traduzir um texto de português para inglês (ou outro idioma)
const traduzir = async (texto, idiomaDestino = 'en') => {
  try {
    const response = await axios.post(LIBRETRANSLATE_URL, {
      q: texto,
      source: 'pt',  // Origem: português
      target: idiomaDestino,  // Destino: idioma desejado
      format: 'text',
    });
    return response.data.translatedText; // Retorna a tradução
  } catch (error) {
    console.error('Erro na tradução com LibreTranslate:', error);
    return null;
  }
};

export default traduzir;
