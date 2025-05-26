import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import FavoriteService from "../api/services/favorites";
import AuthService from "../api/auth";
import { FaRegHeart, FaHeart } from "react-icons/fa";

const FavoriteButton = ({ businessId }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificação de favoritos APENAS quando o componente é montado
  useEffect(() => {
    const checkAuthAndFavorites = async () => {
      try {
        // Verifica silenciosamente se está logado SEM redirecionar
        const token = localStorage.getItem("token");
        if (!token) return;

        const user = await AuthService.getCurrentUser();
        if (!user) return;

        // Só verifica favoritos se estiver autenticado
        const { data } = await FavoriteService.getUserFavorites();
        const favorite = data.find((fav) => fav?.business?._id === businessId);
        if (favorite) {
          setIsFavorite(true);
          setFavoriteId(favorite._id);
        }
      } catch (error) {
        console.error("Verificação inicial de favoritos falhou:", error);
      }
    };

    checkAuthAndFavorites();
  }, [businessId]);

  const handleToggleFavorite = async () => {
    if (loading) return;

    try {
      setLoading(true);

      // Verifica autenticação apenas no clique
      const user = await AuthService.getCurrentUser();
      if (!user) {
        navigate("/login", { state: { from: window.location.pathname } });
        return;
      }

      // Lógica de toggle
      if (isFavorite) {
        await FavoriteService.removeFavorite(favoriteId);
        setIsFavorite(false);
        setFavoriteId(null);
      } else {
        const response = await FavoriteService.addFavorite(businessId);
        setIsFavorite(true);
        setFavoriteId(response._id);
      }
    } catch (error) {
      console.error("Erro ao alternar favorito:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleFavorite}
      disabled={loading}
      className={`favorite-button ${isFavorite ? "favorited" : ""}`}
      aria-label={
        isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
      }
    >
      {isFavorite ? <FaHeart color="red" /> : <FaRegHeart color="#666" />}
      {loading && <span className="loading-spinner"></span>}
    </button>
  );
};

export default FavoriteButton;
