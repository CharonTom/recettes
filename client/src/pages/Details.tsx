// src/pages/Details.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Recipe } from "./Home";
import { FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import Carousel from "../components/Carousel";

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;
  const { token } = useAuth();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get<Recipe>(`${BASE_URL}/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipe(res.data);
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la recette.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchRecipe();
  }, [id, BASE_URL, token]);

  if (loading)
    return (
      <main className="details-page flex-center">
        <p className="text-slate-400">Chargement de la recette...</p>
      </main>
    );

  if (error)
    return (
      <main className="details-page flex-center">
        <p className="text-red-500">{error}</p>
      </main>
    );

  if (!recipe) return null;

  return (
    <main className="details-page">
      <article className="details-card">
        {/* Carrousel d'images */}
        <Carousel images={recipe.imageUrls} alt={recipe.title} />

        {/* Contenu texte */}
        <div className="details-content">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 button-primary mb-4"
          >
            <FaArrowLeft className="text-xs" />
            Retour aux recettes
          </button>

          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            {recipe.title}
          </h1>

          <div className="details-meta">
            {recipe.author?.name && (
              <span className="details-meta-chip">
                Recette de {recipe.author.name}
              </span>
            )}

            <span className="text-xs text-slate-500">
              Publiée le{" "}
              {new Date(recipe.createdAt).toLocaleDateString("fr-FR", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          {recipe.description && (
            <section>
              <h2 className="text-sm font-semibold text-slate-800 mb-2 uppercase tracking-wide">
                Description
              </h2>
              <p className="details-description">{recipe.description}</p>
            </section>
          )}
        </div>
      </article>
    </main>
  );
};

export default Details;
