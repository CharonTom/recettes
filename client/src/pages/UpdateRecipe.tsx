import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Recipe } from "../types/types";

const UpdateRecipe = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingRecipe, setLoadingRecipe] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecipe = async () => {
      if (!id) return;
      try {
        setLoadingRecipe(true);
        setError(null);
        const res = await axios.get<Recipe>(`${BASE_URL}/api/recipes/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecipe(res.data);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
      } catch (err) {
        console.error(err);
        setError("Impossible de charger la recette à modifier.");
      } finally {
        setLoadingRecipe(false);
      }
    };

    fetchRecipe();
  }, [id, BASE_URL, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Le titre est obligatoire");
      return;
    }

    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      await axios.put(
        `${BASE_URL}/api/recipes/${id}`,
        {
          title: title.trim(),
          description: description.trim(),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      navigate(`/home`);
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la mise à jour de la recette.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingRecipe) {
    return (
      <main className="details-page flex-center">
        <p className="text-slate-400">Chargement de la recette...</p>
      </main>
    );
  }

  if (error && !recipe) {
    return (
      <main className="details-page flex-center">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  if (!recipe) return null;

  return (
    <main className="details-page">
      <section className="details-card max-w-2xl mx-auto">
        <div className="details-content">
          <header className="mb-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-pink-500 mb-2">
              Modifier la recette
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Mettre à jour &quot;{recipe.title}&quot;
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Ajuste le titre ou la description de ta recette. Les photos
              restent inchangées pour le moment.
            </p>
          </header>

          {error && (
            <p className="mb-4 rounded-xl border border-pink-400 bg-pink-50 px-4 py-3 text-sm text-pink-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="title"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2"
                >
                  Titre de la recette
                </label>
                <input
                  id="title"
                  type="text"
                  className="w-full rounded-2xl border border-pink-500 bg-white/95 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-500 transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  className="w-full rounded-2xl border border-pink-500 bg-white/95 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-500 transition min-h-32 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="button-primary"
              >
                {loading ? "Mise à jour..." : "Mettre à jour la recette"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="button-secondary"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default UpdateRecipe;
