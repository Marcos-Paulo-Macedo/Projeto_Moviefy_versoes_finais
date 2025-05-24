import express from 'express';
import bodyParser from 'body-parser';
import { TextGenerationClient } from '@google-ai/generativelanguage';
import dotenv from 'dotenv';

dotenv.config(); // Para carregar as variáveis do arquivo .env

const app = express();
const port = 3001;

app.use(bodyParser.json()); // Para ler JSON no body da requisição

// Instanciar o client da API do Google
const client = new TextGenerationClient();

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const promptText = `
Você é um assistente especialista em filmes. Responda apenas perguntas relacionadas a filmes.
Usuário pergunta: "${message}"
Resposta:
    `;

    const response = await client.generateText({
      model: 'models/text-bison-001',
      prompt: {
        text: promptText,
      },
      temperature: 0.7,
      maxOutputTokens: 300,
    });

    const reply = response.candidates?.[0]?.output || 'Desculpe, não entendi.';

    res.json({ reply });
  } catch (error) {
    console.error('Erro Gemini:', error);
    res.status(500).json({ error: error.message });
  }
});

// Rodar o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
