import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import {
  FaUtensils,
  FaBook,
  FaHeart,
  FaPlus,
  FaSearch,
  FaUsers,
  FaTrash,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface JwtPayload {
  email?: string;
  id?: string;
}

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  prepTime: number;
  cookTime: number;
  serves: number;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
  authorEmail?: string;
}

const Home = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const userEmail = useMemo(() => {
    if (!token) return "Utilisateur";
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.email || "Utilisateur";
    } catch {
      return "Utilisateur";
    }
  }, [token]);

  // Charger les recettes
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<Recipe[]>(`${BASE_URL}/api/recipes`);
        setRecipes(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger vos recettes pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRecipes();
  }, [BASE_URL, token]);

  const handleDeleteRecipe = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la recette.");
    }
  };

  const recipesCount = recipes.length;
  const favoritesCount = recipes.filter((r) => r.isFavorite).length;

  return (
    <div className="home-page min-h-screen">
      {/* Hero */}
      <section className="home-hero">
        <div className="container mx-auto px-4 py-12">
          <h2 className="home-hero-title">
            Bienvenue, {userEmail.split("@")[0]} !
          </h2>
          <p className="home-hero-subtitle">
            Découvrez et partagez les recettes transmises de génération en
            génération
          </p>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Search */}
        <div className="home-search-container mb-8">
          <div className="home-search-field">
            <FaSearch className="text-xl text-slate-400" />
            <input
              type="text"
              placeholder="Rechercher une recette... (à venir)"
              className="home-search-input"
              disabled
            />
          </div>
        </div>

        {/* Bouton ajout */}
        <div className="mb-10 flex justify-end">
          <button
            type="button"
            onClick={() => navigate("/recipes/new")}
            className="btn-primary flex items-center gap-2"
          >
            <FaPlus />
            Ajouter une recette
          </button>
        </div>

        {error && (
          <div className="login-error mb-6">
            <p>{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="home-stats-grid mb-12">
          <div className="home-stat-card">
            <FaBook className="text-2xl" />
            <div>
              <p className="home-stat-value">{recipesCount}</p>
              <p className="home-stat-label">Recettes</p>
            </div>
          </div>

          <div className="home-stat-card">
            <FaHeart className="text-2xl" />
            <div>
              <p className="home-stat-value">{favoritesCount}</p>
              <p className="home-stat-label">Favoris</p>
            </div>
          </div>

          <div className="home-stat-card">
            <FaUsers className="text-2xl" />
            <div>
              <p className="home-stat-value">0</p>
              <p className="home-stat-label">Membres</p>
            </div>
          </div>
        </div>

        {/* Liste recettes */}
        <section>
          <h3 className="home-section-title mb-6">Mes recettes</h3>

          {loading ? (
            <p className="text-slate-400">Chargement...</p>
          ) : recipes.length === 0 ? (
            <div className="home-empty-state">
              <FaUtensils className="text-5xl text-slate-600 mb-4" />
              <p className="text-slate-500">Aucune recette pour le moment</p>
            </div>
          ) : (
            <div className="home-recipes-grid">
              {recipes.map((recipe) => (
                <article key={recipe._id} className="home-recipe-card">
                  <div className="flex-between mb-2">
                    <h4 className="text-lg font-semibold line-clamp-1">
                      {recipe.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <FaTrash />
                    </button>
                  </div>

                  {recipe.description && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-2">
                      {recipe.description}
                    </p>
                  )}

                  <p className="text-xs text-slate-500">
                    Créée le{" "}
                    {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
                    {recipe.authorEmail &&
                      ` — publié par ${recipe.authorEmail}`}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Home;
