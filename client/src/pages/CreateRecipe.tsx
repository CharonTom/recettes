import { useState, useMemo } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  email?: string;
  id?: string;
}

const CreateRecipe = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const BASE_URL = import.meta.env.VITE_SERVER_URL;

  // Récupération de l'email depuis le token
  const authorEmail = useMemo(() => {
    if (!token) return "";
    try {
      return jwtDecode<JwtPayload>(token)?.email ?? "";
    } catch {
      return "";
    }
  }, [token]);

  // State du formulaire
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([""]);
  const [steps, setSteps] = useState<string[]>([""]);
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
        ingredients: ingredients.filter(Boolean),
        steps: steps.filter(Boolean),
        authorEmail, // Email ajouté automatiquement
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
          className="login-input min-h-[100px]"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Ingrédients */}
        <div>
          <h4 className="mb-2 font-medium">Ingrédients</h4>
          {ingredients.map((ing, i) => (
            <input
              key={i}
              className="login-input mb-2"
              placeholder={`Ingrédient ${i + 1}`}
              value={ing}
              onChange={(e) => {
                const copy = [...ingredients];
                copy[i] = e.target.value;
                setIngredients(copy);
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => setIngredients([...ingredients, ""])}
            className="text-sm text-blue-400"
          >
            + Ajouter un ingrédient
          </button>
        </div>

        {/* Étapes */}
        <div>
          <h4 className="mb-2 font-medium">Étapes</h4>
          {steps.map((step, i) => (
            <textarea
              key={i}
              className="login-input mb-2"
              placeholder={`Étape ${i + 1}`}
              value={step}
              onChange={(e) => {
                const copy = [...steps];
                copy[i] = e.target.value;
                setSteps(copy);
              }}
            />
          ))}
          <button
            type="button"
            onClick={() => setSteps([...steps, ""])}
            className="text-sm text-blue-400"
          >
            + Ajouter une étape
          </button>
        </div>

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
