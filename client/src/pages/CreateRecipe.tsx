import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // State du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
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

      await axios.post(`${BASE_URL}/api/recipes`, {
        title: title.trim(),
        description: description.trim(),
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
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      <h2 className="text-2xl font-semibold mb-8">Nouvelle recette</h2>

      {error && <p className="login-error mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-6">
        {/* Titre */}
        <input
          type="text"
          placeholder="Titre de la recette"
          className="login-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          className="login-input min-h-25"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Actions */}
        <div className="flex gap-4">
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Création..." : "Créer la recette"}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-secondary"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateRecipe;
