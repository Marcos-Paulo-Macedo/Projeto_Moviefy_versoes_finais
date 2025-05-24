import React, { useState, useEffect } from 'react';
import { auth, db } from '../components/firebase';
import { doc, getDoc, updateDoc, arrayRemove, collection, getDocs, deleteDoc } from 'firebase/firestore';
import './perfil.css';
import { useNavigate } from 'react-router-dom';


const Perfil = () => {
  const [photoBase64, setPhotoBase64] = useState('');
  const [loading, setLoading] = useState(false);
  const [favoritos, setFavoritos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [sugeridos, setSugeridos] = useState([]);
  const user = auth.currentUser;
  const navigate = useNavigate();

  // Função para buscar detalhes do filme por ID na API do TMDb
  const fetchMovieDetails = async (movieId) => {
    const API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMWRlN2I2MmNmMjRkNDRjNzliZTIxMjVhNGQwM2ZlOCIsIm5iZiI6MTc0Mjk0MzE2NC4xMzQsInN1YiI6IjY3ZTMzM2JjZWM5OGJmMGEwZDc1ZmMzNyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aZ9mlvBCiqGiX2exCjthB6cwtJdVCC13HLgEgVw4FwQ'; // Substitua pelo seu token de acesso
    const movieUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_TOKEN}&language=pt-BR`;

    try {
      const response = await fetch(movieUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do filme');
      }

      const movieData = await response.json();
      return movieData;

    } catch (error) {
      console.error('Erro:', error);
      return null;
    }
  };

    const goToMovie = (movieId) => {
    navigate(`/movie/${movieId}`);
    };
    
    const removerAvaliacao = async (movieId) => {
      if (!user) {
        console.error('Usuário não autenticado.');
        return;
      }

      try {
        // Referência do documento da avaliação
        const docRef = doc(db, 'avaliacoes', user.uid, 'filmes', movieId.toString());

        // Apagar o documento da avaliação no Firestore
        await deleteDoc(docRef);

        // Atualizar o estado local removendo a avaliação
        setAvaliacoes((prevAvaliacoes) =>
          prevAvaliacoes.filter((avaliacao) => avaliacao.movieId !== movieId)
        );
      } catch (error) {
        console.error('Erro ao remover avaliação:', error);
      }

      console.log('UID:', user?.uid, 'MovieID:', movieId);
    };

  // Função para buscar os dados do usuário (incluindo filmes favoritos e a foto)
  const fetchUserData = async () => {
    if (user) {
      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        const userData = userDoc.data();

        setPhotoBase64(userData?.photoBase64 || '');

        const favoriteIds = userData?.favoritos || [];
        const favoriteMovieDetails = await Promise.all(
          favoriteIds.map(async (movieId) => {
            const details = await fetchMovieDetails(Number(movieId));
            return details;
          })
        );
        setFavoritos(favoriteMovieDetails.filter(movie => movie));

        // Buscar avaliações do usuário
        const reviewsCollection = collection(db, 'avaliacoes', user.uid, 'filmes');
        const reviewsSnapshot = await getDocs(reviewsCollection);
        const userReviews = reviewsSnapshot.docs.map(doc => doc.data());
        setAvaliacoes(userReviews);

        setSugeridos(userData?.sugeridos || []);

      } catch (error) {
        console.error('Erro ao carregar dados do usuário', error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Data = reader.result;
        setPhotoBase64(base64Data);
        updateUserPhoto(base64Data);
        setLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const updateUserPhoto = async (base64) => {
    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }
    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, { photoBase64: base64 });
    } catch (error) {
      console.error('Erro ao salvar imagem no Firestore:', error);
    }
  };

  const removeFavorite = async (movieId) => {
    if (!user) {
      console.error('Usuário não autenticado');
      return;
    }

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favoritos: arrayRemove(String(movieId)),
      });
      setFavoritos((prevFavoritos) =>
        prevFavoritos.filter((filme) => filme.id !== movieId)
      );
    } catch (error) {
      console.error('Erro ao remover filme dos favoritos:', error);
    }
  };

  return (
    <div className="perfil-container">
      <aside className="perfil-sidebar">
        <h2>🎧 Meu Perfil</h2>
        <button onClick={() => window.location.href = '/'}>🏠 Voltar à Home</button>
      </aside>

      <main className="perfil-content">
        <section className="perfil-top">
          <div className="perfil-photo">
            <img
              src={photoBase64 || '/default-user.png'}
              alt="Perfil"
              style={{ maxWidth: '200px', borderRadius: '50%' }}
            />
            <label htmlFor="photoUpload">📸 Alterar Foto</label>
            <input type="file" id="photoUpload" accept="image/*" onChange={handleImageUpload} />
            {loading && <p>Carregando...</p>}
          </div>
          <div className="perfil-info">
            <h3>{user?.displayName || 'Nome do Usuário'}</h3>
            <p>Email: {user?.email}</p>
          </div>
        </section>

        <section className="perfil-sections">
          <div className="perfil-card">
            <h4>⭐ Favoritos</h4>
            {favoritos.length > 0 ? (
              <div className="favoritos-grid">
                {favoritos.map((filme) => (
                  <div key={filme.id} className="favorito-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                      alt={filme.title}
                    />
                    <p>{filme.title}</p>
                    <button onClick={() => removeFavorite(filme.id)}>Remover favorito</button>
                  </div>
                ))}
              </div>
            ) : (
              <p>Você não tem filmes favoritos ainda.</p>
            )}
          </div>

    <div className="perfil-card">
      <h4>⭐ Minhas Avaliações</h4>
      {avaliacoes.length > 0 ? (
        <div className="avaliacoes-grid">
          {avaliacoes.map((avaliacao, index) => (
            <div key={index} className="avaliacao-item">
              <p alt={`Poster de ${avaliacao.movieTitle}`}/>
              <div className="avaliacao-item-content">
                <h5>{avaliacao.movieTitle}</h5>
                <p>{avaliacao.comentario}</p>
                <p>
                  <strong>Nota:</strong> {avaliacao.nota} / 10 ⭐
                </p>
                <button className="btn-remover-avaliacao" onClick={() => removerAvaliacao(avaliacao.movieId)}>
                  Remover Avaliação
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>Você ainda não avaliou nenhum filme.</p>
      )}
    </div>

          <div className="perfil-card">
            <h4>🎬 Filmes Sugeridos</h4>
            {sugeridos.length > 0 ? (
              <div className="sugeridos-grid">
                {sugeridos.map((filme) => (
                  <div key={filme.id} className="sugerido-item">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                      alt={filme.title}
                    />
                    <p>{filme.title}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p>Você não tem filmes sugeridos ainda.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Perfil;