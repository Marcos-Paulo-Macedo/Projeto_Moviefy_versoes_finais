import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import './authPage.css';
import { onAuthStateChanged } from 'firebase/auth';


export const useAuth = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  return { user };
};

export const AuthPage = ({ isLogin }) => {
  const [mode, setMode] = useState(isLogin ? 'login' : 'signup');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const re = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return re.test(email);
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /[\W_]/.test(password)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('Insira um e-mail válido.');
      return;
    }

    if (!validatePassword(password)) {
      setErrorMessage('A senha deve conter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas e caractere especial.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        // Aqui você pode salvar telefone/país depois no Firestore
      }
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/user-not-found') setErrorMessage('Usuário não encontrado.');
      else if (error.code === 'auth/wrong-password') setErrorMessage('Senha incorreta.');
      else if (error.code === 'auth/email-already-in-use') setErrorMessage('Este email já está em uso.');
      else setErrorMessage('Erro ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <h2>{mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {mode === 'signup' && (
            <>
              <input
                type="tel"
                placeholder="Telefone (opcional)"
                value={phone}
                onChange={e => setPhone(e.target.value)}
              />
              <input
                type="text"
                placeholder="País (opcional)"
                value={country}
                onChange={e => setCountry(e.target.value)}
              />
            </>
          )}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button type="submit" disabled={loading}>
            {loading ? 'Carregando...' : mode === 'login' ? 'Entrar' : 'Cadastrar'}
          </button>
        </form>

        <div className="divider">ou</div>
        <button className="google-login-btn" onClick={() => alert('Integração Google em breve')}>
          Entrar com Google
        </button>

        <p className="toggle-mode">
          {mode === 'login' ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
          <span onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Cadastre-se' : 'Faça login'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
