import { FaRegEdit } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import type { RecipeCardProps } from "../types/types";
import DefaultImage from "../assets/default.jpg";
import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { FiTrash2 } from "react-icons/fi";

const RecipeCard = ({ recipe, handleDeleteRecipe }: RecipeCardProps) => {
  const { token } = useAuth();
  const navigate = useNavigate();
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

  const isOwner =
    !!currentUserId && recipe.author && recipe.author._id === currentUserId;

  return (
    <>
      <Link
        key={recipe._id}
        to={`/recipes/detail/${recipe._id}`}
        className="recipe-card"
        style={backgroundStyle}
      >
        <article className="p-4 pb-2">
          <div>
            <div className="relative">
              <h4 className="text-white [text-shadow:_3px_3px_3px_rgb(0_0_0_/_30%)] bg-pink-400/80 inline-block px-2 py-1 rounded-md font-semibold text-lg max-w-[80%]">
                {recipe.title}
              </h4>
              {isOwner && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    navigate(`/recipes/update/${recipe._id}`);
                  }}
                  className="text-pink-500 hover:text-pink-800 absolute top-0 right-8 bg-white/90 rounded-full p-1 shadow-sm cursor-pointer text-xl"
                >
                  <FaRegEdit />
                </button>
              )}
              {isOwner && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsConfirmDeleteOpen(true);
                  }}
                  className="text-pink-500 hover:text-pink-800 absolute top-0 right-0 bg-white/90 rounded-full p-1 shadow-sm cursor-pointer text-xl"
                >
                  <FiTrash2 />
                </button>
              )}
            </div>
          </div>

          <p className="recipe-card-meta absolute bottom-4">
            Publiée le {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
            {recipe.author && ` par ${recipe.author.name}`}
          </p>
        </article>
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
