const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { GoogleGenerativeAI } = require('@google/generative-ai');
import pkg from '@google-ai/generativelanguage';
const { TextGenerationClient } = pkg;

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Substitua por sua chave da API do Gemini
const genAI = new GoogleGenerativeAI('SUA_CHAVE_AQUI');

app.post('/gemini', async (req, res) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt ausente.' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });
  } catch (error) {
    console.error('Erro no Gemini:', error);
    res.status(500).json({ error: 'Erro ao gerar texto com Gemini.' });
  }
});

app.listen(3001, () => {
  console.log('✅ Servidor rodando em http://localhost:3001');
});
