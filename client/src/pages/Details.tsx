// src/pages/Details.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Recipe } from "./Home";
import { FaArrowLeft } from "react-icons/fa";

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<Recipe>(`${BASE_URL}/api/recipes/${id}`);
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la recette.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id, BASE_URL]);

  if (loading) return <p className="text-slate-400">Chargement...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!recipe) return null;

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 text-blue-500"
      >
        <FaArrowLeft /> Retour
      </button>

      <h1 className="text-3xl font-bold mb-4">{recipe.title}</h1>

      {recipe.authorEmail && (
        <p className="text-sm text-slate-500 mb-4">
          Publié par {recipe.authorEmail} le{" "}
          {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
        </p>
      )}

      {recipe.description && (
        <p className="mb-6 text-slate-700">{recipe.description}</p>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Ingrédients</h2>
        <ul className="list-disc list-inside">
          {recipe.ingredients.map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Étapes</h2>
        <ol className="list-decimal list-inside">
          {recipe.steps.map((step, i) => (
            <li key={i} className="mb-1">
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="flex gap-6 text-slate-600">
        <p>Préparation : {recipe.prepTime} min</p>
        <p>Cuisson : {recipe.cookTime} min</p>
        <p>Pour : {recipe.serves} personne(s)</p>
        <p>Favori : {recipe.isFavorite ? "Oui" : "Non"}</p>
      </div>
    </div>
  );
};

export default Details;
