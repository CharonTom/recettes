// src/pages/Details.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import type { Recipe } from "./Home";
import { FaArrowLeft } from "react-icons/fa";
import DefaultImage from "../assets/default.jpg";

const Details = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  const images =
    recipe.imageUrls && recipe.imageUrls.length > 0
      ? recipe.imageUrls
      : [DefaultImage];

  const totalImages = images.length;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? totalImages - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === totalImages - 1 ? 0 : prev + 1));
  };

  return (
    <main className="details-page">
      <article className="details-card">
        {/* Carrousel d'images */}

        <div className="details-image-wrapper cursor-zoom-in">
          <img
            src={images[currentImageIndex]}
            alt={recipe.title}
            className="details-image"
            onClick={() => setIsFullscreen(true)}
          />

          {totalImages > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrevImage}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md w-9 h-9 flex items-center justify-center text-lg cursor-pointer"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={handleNextImage}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white text-pink-600 shadow-md w-9 h-9 flex items-center justify-center text-lg cursor-pointer"
              >
                ›
              </button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/50 backdrop-blur text-[10px] text-slate-100">
                {images.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all ${
                      index === currentImageIndex
                        ? "w-4 bg-pink-400"
                        : "w-2 bg-slate-400/70"
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Bouton pour le plein écran */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="absolute bottom-3 right-3 rounded-full bg-slate-900/70 hover:bg-slate-900 text-xs sm:text-[13px] text-slate-50 px-4 py-2 shadow-md cursor-pointer"
          >
            Cliquer l'image pour voir en plein écran
          </button>
        </div>

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

      {/* Modal plein écran */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 flex items-center justify-center px-4">
          <div className="relative w-full max-w-5xl">
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute -top-10 right-0 text-slate-200 hover:text-white text-sm underline underline-offset-4 cursor-pointer"
            >
              Fermer
            </button>

            <div className="relative bg-slate-900/60 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl">
              <img
                src={images[currentImageIndex]}
                alt={recipe.title}
                className="w-full max-h-[80vh] object-contain bg-black"
              />

              {totalImages > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white text-pink-600 shadow-lg w-11 h-11 flex items-center justify-center text-2xl cursor-pointer"
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 hover:bg-white text-pink-600 shadow-lg w-11 h-11 flex items-center justify-center text-2xl cursor-pointer"
                  >
                    ›
                  </button>

                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/65 backdrop-blur text-[11px] text-slate-100">
                    {images.map((_, index) => (
                      <span
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentImageIndex
                            ? "w-5 bg-pink-400"
                            : "w-2 bg-slate-500/70"
                        }`}
                      />
                    ))}
                    <span className="ml-1 opacity-80">
                      {currentImageIndex + 1} / {totalImages}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Details;
