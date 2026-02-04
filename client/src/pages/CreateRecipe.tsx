import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CreateRecipe = () => {
  const navigate = useNavigate();
  useAuth(); // on garde le hook pour s'assurer que l'utilisateur est authentifié
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // State du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("Le titre est obligatoire");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post(`${BASE_URL}/api/recipes`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/home"); // Redirection vers le dashboard
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la création de la recette");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="details-page">
      <section className="details-card max-w-2xl mx-auto">
        <div className="details-content">
          <header className="mb-6">
            <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
              Créer une nouvelle recette
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Donne un joli titre, décris ta recette et ajoute quelques photos
              si tu le souhaites.
            </p>
          </header>

          {error && (
            <p className="mb-4 rounded-xl border border-pink-400 bg-pink-50 px-4 py-3 text-sm text-pink-700">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Titre */}
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
                  placeholder="Note ici le titre de la recette"
                  className="w-full rounded-2xl border border-pink-500 bg-white/95 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-500 transition"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  placeholder="Note ici les ingrédients, les étapes..."
                  className="w-full rounded-2xl border border-pink-500 bg-white/95 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 focus:border-pink-500 transition min-h-32 resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Images */}
              <div>
                <label
                  htmlFor="images"
                  className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-4"
                >
                  Photos de la recette (optionnelles)
                </label>

                <label htmlFor="images" className="button-primary">
                  Choisir mes images
                </label>

                <input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const files = e.target.files
                      ? Array.from(e.target.files)
                      : [];
                    setImages(files);
                  }}
                />

                <p className="mt-2 text-xs text-slate-500">
                  {images.length > 0
                    ? `${images.length} fichier(s) sélectionné(s)`
                    : "Aucune image sélectionnée pour l’instant."}
                </p>

                {images.length > 0 && (
                  <ul className="mt-1 text-xs text-slate-500 space-y-1">
                    {images.map((file) => (
                      <li key={file.name} className="truncate">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="button-primary"
              >
                {loading ? "Création en cours..." : "Créer la recette"}
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

export default CreateRecipe;
