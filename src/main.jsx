import React from 'react';
import ReactDOM from 'react-dom/client'; // Importando de 'react-dom/client' para React 18
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Criação do root usando 'createRoot' no React 18
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
