import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { Recipe } from "../pages/Home";
import DefaultImage from "../assets/default.jpg";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

interface RecipeCardProps {
  recipe: Recipe;
  handleDeleteRecipe: (id: string) => void;
}

const RecipeCard = ({ recipe, handleDeleteRecipe }: RecipeCardProps) => {
  const { token } = useAuth();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  let currentUserId: string | null = null;
  if (token) {
    try {
      const decoded = jwtDecode<{ id: string }>(token);
      currentUserId = decoded.id ?? null;
    } catch {
      currentUserId = null;
    }
  }

  const firstImage =
    recipe.imageUrls && recipe.imageUrls.length > 0
      ? recipe.imageUrls[0]
      : DefaultImage;

  const backgroundStyle = firstImage
    ? {
        backgroundImage: `url(${firstImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  const canDelete =
    !!currentUserId && recipe.author && recipe.author._id === currentUserId;

  return (
    <>
      <Link
        key={recipe._id}
        to={`/recipes/detail/${recipe._id}`}
        className="recipe-card"
        style={backgroundStyle}
      >
        <div className="p-4 pb-2">
          <div className="recipe-card-header relative">
            <h4 className="recipe-card-title">{recipe.title}</h4>
            {canDelete && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setIsConfirmDeleteOpen(true);
                }}
                className="text-pink-500 hover:text-red-800 absolute top-0 right-0 bg-white/90 rounded-full p-1 shadow-sm cursor-pointer"
              >
                <FaTrash />
              </button>
            )}
          </div>
        </div>

        <div className="px-4 pb-3">
          <p className="recipe-card-meta">
            Publiée le {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
            {recipe.author && ` par ${recipe.author.name}`}
          </p>
        </div>
      </Link>
      <ConfirmDeleteModal
        open={isConfirmDeleteOpen}
        title="Supprimer la recette"
        message={`Voulez-vous vraiment supprimer votre recette "${recipe.title}" ?`}
        onCancel={() => setIsConfirmDeleteOpen(false)}
        onConfirm={() => {
          handleDeleteRecipe(recipe._id);
          setIsConfirmDeleteOpen(false);
        }}
      />
    </>
  );
};

export default RecipeCard;
