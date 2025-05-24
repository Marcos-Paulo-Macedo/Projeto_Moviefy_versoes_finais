import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/home';
import MovieList from './pages/movieList';
import MovieInfo from './pages/movieInfo';
import Pesquisa from './pages/pesquisa';
import { AuthPage } from './components/authPage';
import Perfil from './pages/perfil';
import PrivateRoute from './privateRoute';
import './App.css';
import BalaoFlutuante from './components/chat';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
    document.body.classList.toggle('light-mode', !isDarkMode);
  }, [isDarkMode]);

  return (
    <div>
      <Routes>
        <Route path="/login" element={<AuthPage isLogin={true} />} />
        <Route path="/cadastro" element={<AuthPage isLogin={false} />} />
        <Route path="/" element={
          <PrivateRoute>
            <Home />
          </PrivateRoute>
        } />
        <Route path="/movies/:genreId" element={
          <PrivateRoute>
            <MovieList />
          </PrivateRoute>
        } />
        <Route path="/movie/:movieId" element={
          <PrivateRoute>
            <MovieInfo />
          </PrivateRoute>
        } />
        <Route path="/pesquisa" element={
          <PrivateRoute>
            <Pesquisa />
          </PrivateRoute>
        } />
        <Route path="/perfil" element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        } /> { }
      </Routes>
      <div>
        <BalaoFlutuante />
        <Routes>
        </Routes>
      </div>
    </div>
  );
}

export default App;
