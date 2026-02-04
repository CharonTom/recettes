import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { FaPlus, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import RecipeCard from "../components/RecipeCard";

export interface Recipe {
  _id: string;
  title: string;
  description: string;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
  author?: {
    _id: string;
    name: string;
  };
}

const Home = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setError] = useState<string | null>(null);

  const BASE_URL = import.meta.env.VITE_SERVER_URL;

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
        setError("Impossible de charger les recettes pour le moment.");
      } finally {
        setLoading(false);
      }
    };

    if (token) fetchRecipes();
  }, [BASE_URL, token]);
  console.log(recipes);

  const handleDeleteRecipe = async (id: string) => {
    try {
      await axios.delete(`${BASE_URL}/api/recipes/${id}`);
      setRecipes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la suppression de la recette.");
    }
  };

  return (
    <main className="px-4 py-8 bg-pink-50 min-h-screen">
      {/* Search */}
      <div className="flex-center mb-6 gap-2">
        <FaSearch className="text-xl text-slate-400" />
        <input
          type="text"
          placeholder="Rechercher une recette"
          className="border border-slate-300 rounded-md px-4 py-2 w-full max-w-md focus:outline-none focus:ring-2 focus:ring-pink-400"
          disabled
        />

        {/* Bouton ajout */}

        <button
          type="button"
          onClick={() => navigate("/recipes/new")}
          className="button-primary flex items-center gap-2"
        >
          <FaPlus />
          Ajouter une recette
        </button>
      </div>

      {/* Liste recettes */}

      {loading ? (
        <p className="text-slate-400">Chargement des recettes...</p>
      ) : recipes.length === 0 ? (
        <p className="text-slate-500 flex-center p-6">
          Aucune recette pour le moment
        </p>
      ) : (
        <div className="flex-center flex-wrap gap-6 my-20">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              handleDeleteRecipe={handleDeleteRecipe}
            />
          ))}
        </div>
      )}
    </main>
  );
};

export default Home;
