import { useParams, Link } from 'react-router-dom';
import {
  getMovieDetails,
  getTrailerUrl,
  getImages,
  getReviews,
  getWatchProviders,
  getExternalIds,
  getPersonMovieCredits
} from '../api/infoFilmesAPI';
import './movieInfos.css';
import { db, auth } from '../components/firebase';
import { doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

const MovieInfo = () => {
  const { movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [images, setImages] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [providers, setProviders] = useState({});
  const [externalIds, setExternalIds] = useState(null);
  const [collection, setCollection] = useState(null);
  const [credits, setCredits] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [reviewContent, setReviewContent] = useState('');
  const [reviewRating, setReviewRating] = useState(0);
  const [message, setMessage] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const details = await getMovieDetails(movieId);
        const trailer = await getTrailerUrl(movieId);
        const imgs = await getImages(movieId);
        const revs = await getReviews(movieId);
        const provs = await getWatchProviders(movieId);
        const extIds = await getExternalIds(movieId);
        setMovie(details);
        if (details?.backdrop_path || details?.poster_path) {
          const page = document.querySelector('.movie-info-page');
          if (page) {
            const imagePath = details.backdrop_path || details.poster_path;
            page.style.setProperty('--bg-url', `url(https://image.tmdb.org/t/p/original${imagePath})`);
          }
        }
        setTrailerUrl(trailer);
        setImages(imgs?.backdrops?.slice(0, 3) || []);
        setReviews(revs?.slice(0, 3) || []);
        setProviders(provs);
        setExternalIds(extIds);

        if (details?.belongs_to_collection) {
          const collectionData = await fetch(
            `https://api.themoviedb.org/3/collection/${details.belongs_to_collection.id}?language=pt-BR`,
            {
              headers: {
                accept: 'application/json',
                Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
              }
            }
          );
          const collectionJson = await collectionData.json();
          setCollection(collectionJson);
        }

        const firstCastId = details?.credits?.cast?.[0]?.id;
        if (firstCastId) {
          const castCredits = await getPersonMovieCredits(firstCastId);
          setCredits(castCredits);
        }
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    };

    fetchData();
  }, [movieId]);

const toggleFavorite = async (userId, movieId) => {
  if (!userId || !movieId) {
    console.error("Usuário ou ID do filme ausente.");
    return;
  }

  try {
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    // Verifica se o documento existe
    if (!userDoc.exists()) {
      console.error("Documento do usuário não encontrado.");
      return;
    }

    const userData = userDoc.data();
    const favoritos = Array.isArray(userData?.favoritos) ? userData.favoritos : [];

    if (favoritos.includes(movieId)) {
      await updateDoc(userRef, {
        favoritos: arrayRemove(movieId),
      });
      setIsFavorited(false);
      console.log(`Filme ${movieId} removido dos favoritos.`);
    } else {
      await updateDoc(userRef, {
        favoritos: arrayUnion(movieId),
      });
      setIsFavorited(true);
      console.log(`Filme ${movieId} adicionado aos favoritos.`);
    }
  } catch (error) {
    console.error("Erro ao atualizar favoritos:", error);
  }
};


  useEffect(() => {
    const checkFavorite = async () => {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          const userFavorites = userDoc.data().favoritos || [];
          setIsFavorited(userFavorites.includes(movieId));
        }
      }
    };

    checkFavorite();
  }, [movieId]);

  // Atualiza o background da página com a imagem do filme
  useEffect(() => {
    const page = document.querySelector('.movie-info-page');
    if (page) {
      page.style.setProperty('--bg-url', ''); // Limpa o background anterior
      if (movie?.backdrop_path || movie?.poster_path) {
        const imagePath = movie.backdrop_path || movie.poster_path;
        const imageUrl = `https://image.tmdb.org/t/p/original${imagePath}`;
        const img = new Image();
        img.src = imageUrl;
        img.onload = () => {
          page.style.setProperty('--bg-url', `url(${imageUrl})`);
        };
      }
    }
  }, [movie]);

  const getUserReviews = async (movieId) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userReviewsRef = doc(db, 'users', user.uid, 'movieReviews', movieId.toString());
        const userReviewsDoc = await getDoc(userReviewsRef);
        return userReviewsDoc.exists() ? userReviewsDoc.data().reviews : [];
      }
      return [];
    } catch (error) {
      console.error('Erro ao buscar avaliações do usuário:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ... outras requisições ...

        // Buscar avaliações de usuários
        const userMovieReviews = await getUserReviews(movieId);
        setReviews(userMovieReviews); // Atualizar o estado de avaliações

        // ... outras ações ...
      } catch (error) {
        console.error('Erro ao carregar os dados:', error);
      }
    };

    fetchData();
  }, [movieId]);


const handleAddReview = async () => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("Você precisa estar logado para avaliar um filme.");
      return;
    }

    if (!reviewContent || reviewRating === 0) {
      alert("Por favor, escreva um comentário e escolha uma nota.");
      return;
    }

    const reviewData = {
      comentario: reviewContent,
      nota: reviewRating,
      movieId: movie.id,
      movieTitle: movie.title,
      timestamp: new Date(),
      autor: user.displayName || user.email,
    };

    const reviewRef = doc(db, 'avaliacoes', user.uid, 'filmes', movie.id.toString());
    await setDoc(reviewRef, reviewData);

    setReviews((prev) => {
      const others = prev.filter((r) => r.autor !== reviewData.autor);
      return [...others, reviewData];
    });

    alert("Avaliação salva com sucesso!");
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    alert("Erro ao salvar a avaliação.");
  }
};

  const handleSubmitReview = async () => {
  if (!reviewContent || reviewRating === 0) {
    setMessage({ type: "error", text: "Por favor, escreva um comentário e escolha uma nota." });
    return;
  }

  const reviewData = {
    comentario: reviewContent,
    nota: reviewRating,
    movieId: movie.id,
    movieTitle: movie.title,
    timestamp: new Date(),
  };

  try {
    const reviewRef = doc(db, "avaliacoes", auth.currentUser.uid, "filmes", movie.id.toString());
    await setDoc(reviewRef, reviewData);
    setMessage({ type: "success", text: "Avaliação salva com sucesso!" });
    
    // Limpar avaliação e estrelas:
    setReviewContent("");
    setReviewRating(0);
  } catch (error) {
    console.error("Erro ao salvar avaliação:", error);
    setMessage({ type: "error", text: "Erro ao salvar a avaliação." });
  }
};




  // Elementos de input para a avaliação
  <div className="review-input-section">
    <textarea
      placeholder="Escreva sua avaliação..."
      value={reviewContent}
      onChange={(e) => setReviewContent(e.target.value)}
    />
    <input
      type="number"
      min="1"
      max="5"
      value={reviewRating}
      onChange={(e) => setReviewRating(e.target.value)}
      placeholder="Avaliação (1-5)"
    />
    <button onClick={handleAddReview}>Adicionar Avaliação</button>
  </div>

  if (!movie) return <div className="loader"></div>;

return (
    <div className="movie-info-page">
      <div className="movie-info-container">
        <h1 className="movie-title">{movie.title}</h1>
        <p className="movie-tagline">{movie.tagline}</p>
        <p><strong>Data de Lançamento:</strong> {movie.release_date}</p>
        <p><strong>Nota:</strong> {movie.vote_average} / 10</p>
        <button
          className={`favorite-btn p-2 rounded-full transition-colors duration-300 ${isFavorited ? 'bg-red-600' : 'bg-transparent'
            }`}
          onClick={() => {
            const user = auth.currentUser;
            if (user) toggleFavorite(user.uid, movieId);
          }}
        >
          {isFavorited ? (
            <FaHeart color="white" size={24} style={{ fill: 'red' }} />
          ) : (
            <FaRegHeart
              color="transparent"
              size={24}
              style={{ stroke: 'white', strokeWidth: 2, fill: 'white' }}
            />
          )}
        </button>

        <p className="movie-overview">{movie.overview}</p>

        {externalIds && (
          <div className="external-links">
            <h3>Redes Oficiais</h3>
            {externalIds.imdb_id && (
              <a href={`https://www.imdb.com/title/${externalIds.imdb_id}`} target="_blank" rel="noopener noreferrer">
                IMDb
              </a>
            )}
            {externalIds.facebook_id && (
              <a href={`https://www.facebook.com/${externalIds.facebook_id}`} target="_blank" rel="noopener noreferrer">
                Facebook
              </a>
            )}
            {externalIds.instagram_id && (
              <a href={`https://www.instagram.com/${externalIds.instagram_id}`} target="_blank" rel="noopener noreferrer">
                Instagram
              </a>
            )}
          </div>
        )}

        {trailerUrl && (
          <div className="trailer-section">
            <h2>Trailer</h2>
            <iframe
              width="560"
              height="315"
              src={trailerUrl.replace('watch?v=', 'embed/')}
              title="Trailer"
              frameBorder="0"
              allowFullScreen
            />
          </div>
        )}

        <div className="images-section">
          <h2>Imagens</h2>
          <div className="image-gallery">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={`https://image.tmdb.org/t/p/w500${img.file_path}`}
                alt={`Cena ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {movie.belongs_to_collection && (
          <div>
            <strong>Parte da coleção:</strong> {movie.belongs_to_collection.name}
          </div>
        )}
        {movie.production_companies?.length > 0 && (
          <div>
            <strong>Produtoras:</strong>{" "}
            {movie.production_companies.map((company, index) => (
              <span key={company.id}>
                {company.name}
                {index < movie.production_companies.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
        {movie.production_countries?.length > 0 && (
          <div>
            <strong>Países de produção:</strong>{" "}
            {movie.production_countries.map((country, index) => (
              <span key={country.iso_3166_1}>
                {country.name}
                {index < movie.production_countries.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
        {movie.runtime && (
          <div>
            <strong>Duração:</strong> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min
          </div>
        )}
        {movie.spoken_languages?.length > 0 && (
          <div>
            <strong>Idiomas:</strong>{" "}
            {movie.spoken_languages.map((lang, index) => (
              <span key={lang.iso_639_1}>
                {lang.english_name}
                {index < movie.spoken_languages.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}
        <div>
          <strong>Nota:</strong> {movie.vote_average.toFixed(1)} ⭐ (
          {movie.vote_count.toLocaleString()} votos)
        </div>

        {movie.genres?.length > 0 && (
          <div>
            <strong>Gêneros:</strong>{" "}
            {movie.genres.map((genre, index) => (
              <span key={genre.id}>
                <Link to={`/movies/${genre.id}`} className="genre-link">
                  {genre.name}
                </Link>
                {index < movie.genres.length - 1 && ", "}
              </span>
            ))}
          </div>
        )}

        {auth.currentUser && (
        <div className="review-input-section">

          <h3>Deixe sua Avaliação</h3>

          <textarea
            placeholder="Escreva sua avaliação..."
            value={reviewContent}
            onChange={(e) => setReviewContent(e.target.value)}
          />

          <div className="star-rating">
            {[...Array(10)].map((_, index) => {
              const ratingValue = index + 1;
              return (
                <label key={ratingValue}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onClick={() => setReviewRating(ratingValue)}
                  />
                  <span
                    className={`star ${ratingValue <= reviewRating ? "filled" : ""}`}
                  >
                    ★
                  </span>
                </label>
              );
            })}
          </div>

          <button onClick={handleSubmitReview}>Enviar Avaliação</button>

          {message && (
            <p className={`review-message ${message.type === "error" ? "error" : "success"}`}>
              {message.text}
            </p>
          )}

        </div>
      )}

        <div className="providers-section">
          <h2>Disponível em:</h2>

          {providers.flatrate || providers.buy || providers.rent ? (
            <>
              {providers.flatrate && (
                <div className="provider-group">
                  <h3>Streaming (assinatura)</h3>
                  <div className="provider-logos">
                    {providers.flatrate.map((prov) => (
                      <div key={prov.provider_id} className="provider-item">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${prov.logo_path}`}
                          alt={prov.provider_name}
                          title={prov.provider_name}
                        />
                        <p>{prov.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {providers.buy && (
                <div className="provider-group">
                  <h3>Para Comprar</h3>
                  <div className="provider-logos">
                    {providers.buy.map((prov) => (
                      <div key={prov.provider_id} className="provider-item">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${prov.logo_path}`}
                          alt={prov.provider_name}
                          title={prov.provider_name}
                        />
                        <p>{prov.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {providers.rent && (
                <div className="provider-group">
                  <h3>Para Alugar</h3>
                  <div className="provider-logos">
                    {providers.rent.map((prov) => (
                      <div key={prov.provider_id} className="provider-item">
                        <img
                          src={`https://image.tmdb.org/t/p/w200${prov.logo_path}`}
                          alt={prov.provider_name}
                          title={prov.provider_name}
                        />
                        <p>{prov.provider_name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p>Não disponível em streaming, compra ou aluguel no Brasil.</p>
          )}
        </div>

        {collection && collection.parts && collection.parts.length > 0 && (
          <div className="collection-section">
            <h2>Parte da Coleção: {collection.name}</h2>
            <div className="collection-list">
              {collection.parts.map((item) => (
                <div key={item.id} className="collection-item">
                  <Link to={`/movie/${item.id}`}>
                    <img
                      src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                      alt={item.title}
                    />
                    <p>{item.title}</p>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {credits && credits.cast && credits.cast.length > 0 ? (
          <div className="credits-section">
            <h2>Elenco</h2>
            <div className="credits-list">
              {credits.cast.map((actor) => (
                <div key={actor.id} className="credit-item">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w200${actor.profile_path}`}
                      alt={actor.name}
                      className="actor-photo"
                    />
                  ) : (
                    <div className="actor-photo-placeholder">Sem Foto</div>
                  )}
                  <div className="actor-info">
                    <p><strong>{actor.name}</strong></p>
                    <p><em>{actor.character}</em></p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p>Elenco não disponível.</p>
        )}

        {/* Botão de voltar DENTRO do movie-info-container */}
        <div className="back-button">
          <Link to="/" className="back-link">Voltar para a Página Inicial</Link>
        </div>
      </div>
    </div>
  );
};

export default MovieInfo;