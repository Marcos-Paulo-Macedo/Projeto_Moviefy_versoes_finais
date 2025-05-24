import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/firebase';
import './App.css'; // Certifique-se de importar o CSS para o spinner

const PrivateRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="spinner-container">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    // Se o usuário não estiver autenticado, redirecione para a página de login
    return <Navigate to="/login" />;
  }

  // Se o usuário estiver autenticado, retorna o conteúdo filho (children)
  return children;
};

export default PrivateRoute;
