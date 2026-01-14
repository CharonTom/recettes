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
  FaClock,
  FaUsers,
  FaTrash,
} from "react-icons/fa";

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
}

const Home = () => {
  const { token } = useAuth();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Formulaire simple de création
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const userEmail = useMemo(() => {
    if (!token) return "Utilisateur";
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.email || "Utilisateur";
    } catch {
      return "Utilisateur";
    }
  }, [token]);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // Charger les recettes de l'utilisateur
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<Recipe[]>(`${BASE_URL}/api/recipes`);
        setRecipes(res.data);
      } catch (err: unknown) {
        console.error(err);
        setError("Impossible de charger vos recettes pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchRecipes();
    }
  }, [BASE_URL, token]);

  const handleCreateRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setError(null);
      const newRecipePayload = {
        title: title.trim(),
        description: description.trim(),
        ingredients: [],
        steps: [],
      };
      const res = await axios.post<Recipe>(
        `${BASE_URL}/api/recipes`,
        newRecipePayload
      );
      setRecipes((prev) => [res.data, ...prev]);
      setTitle("");
      setDescription("");
    } catch (err: unknown) {
      console.error(err);
      setError("Erreur lors de la création de la recette.");
    }
  };

  const handleDeleteRecipe = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err: unknown) {
      console.error(err);
      setError("Erreur lors de la suppression de la recette.");
    }
  };

  const recipesCount = recipes.length;
  const favoritesCount = recipes.filter((r) => r.isFavorite).length;

  return (
    <div className="home-page min-h-screen">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="container mx-auto px-4 py-12">
          <div className="home-hero-content">
            <h2 className="home-hero-title">
              Bienvenue, {userEmail.split("@")[0]} !
            </h2>
            <p className="home-hero-subtitle">
              Découvrez et partagez les recettes transmises de génération en
              génération
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Search Bar + création rapide */}
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

        {/* Formulaire simple de création de recette (titre + description) */}
        <form
          onSubmit={handleCreateRecipe}
          className="mb-10 grid gap-4 md:grid-cols-[2fr,3fr,auto] items-start"
        >
          <div className="login-field">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la recette"
              className="login-input"
            />
          </div>
          <div className="login-field">
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (facultatif)"
              className="login-input"
            />
          </div>
          <button
            type="submit"
            className="btn-primary flex items-center gap-2 whitespace-nowrap"
          >
            <FaPlus />
            Ajouter
          </button>
        </form>

        {error && (
          <div className="login-error mb-6 text-left">
            <p>{error}</p>
          </div>
        )}

        {/* Stats Cards */}
        <div className="home-stats-grid mb-12">
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <FaBook className="text-2xl" />
            </div>
            <div>
              <p className="home-stat-value">{recipesCount}</p>
              <p className="home-stat-label">Recettes</p>
            </div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <FaHeart className="text-2xl" />
            </div>
            <div>
              <p className="home-stat-value">{favoritesCount}</p>
              <p className="home-stat-label">Favoris</p>
            </div>
          </div>
          <div className="home-stat-card">
            <div className="home-stat-icon">
              <FaUsers className="text-2xl" />
            </div>
            <div>
              <p className="home-stat-value">0</p>
              <p className="home-stat-label">Membres</p>
            </div>
          </div>
        </div>

        {/* Recipes Section */}
        <section className="mb-8">
          <div className="flex-between mb-6">
            <h3 className="home-section-title">Mes recettes</h3>
            <button className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
              Voir tout
            </button>
          </div>

          {loading ? (
            <div className="home-empty-state">
              <p className="text-slate-400">Chargement de vos recettes...</p>
            </div>
          ) : recipes.length === 0 ? (
            <div className="home-empty-state">
              <FaUtensils className="text-5xl text-slate-600 mb-4" />
              <h4 className="text-xl font-semibold text-slate-300 mb-2">
                Aucune recette pour le moment
              </h4>
              <p className="text-slate-500 mb-6">
                Commencez par ajouter votre première recette de famille !
              </p>
            </div>
          ) : (
            <div className="home-recipes-grid">
              {recipes.map((recipe) => (
                <article key={recipe._id} className="home-recipe-card">
                  <div className="flex-between mb-2 gap-4">
                    <h4 className="text-lg font-semibold text-slate-50 line-clamp-1">
                      {recipe.title}
                    </h4>
                    <button
                      type="button"
                      onClick={() => handleDeleteRecipe(recipe._id)}
                      className="text-slate-500 hover:text-red-400 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  {recipe.description && (
                    <p className="text-sm text-slate-400 line-clamp-2 mb-3">
                      {recipe.description}
                    </p>
                  )}
                  <p className="text-[11px] text-slate-500">
                    Créée le{" "}
                    {new Date(recipe.createdAt).toLocaleDateString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>

        {/* Recent Activity */}
        <section>
          <h3 className="home-section-title mb-6">Activité récente</h3>
          <div className="home-empty-state">
            <FaClock className="text-4xl text-slate-600 mb-4" />
            <p className="text-slate-500">Aucune activité récente à afficher</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
