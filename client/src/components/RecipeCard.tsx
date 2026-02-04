import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";
import type { Recipe } from "../pages/Home";
import DefaultImage from "../assets/default.jpg";

interface RecipeCardProps {
  recipe: Recipe;
  handleDeleteRecipe: (id: string) => void;
}

const RecipeCard = ({ recipe, handleDeleteRecipe }: RecipeCardProps) => {
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

  return (
    <Link
      key={recipe._id}
      to={`/recipes/detail/${recipe._id}`}
      className="recipe-card"
      style={backgroundStyle}
    >
      <div className="p-4 pb-2">
        <div className="recipe-card-header">
          <h4 className="recipe-card-title">{recipe.title}</h4>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // empêche la navigation si on clique sur le trash
            handleDeleteRecipe(recipe._id);
          }}
          className="text-pink-500 hover:text-red-800 absolute top-3 right-3 bg-white/90 rounded-full p-1 shadow-sm"
        >
          <FaTrash />
        </button>
      </div>

      <div className="px-4 pb-3">
        <p className="recipe-card-meta">
          Publiée le {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
          {recipe.author && ` par ${recipe.author.name}`}
        </p>
      </div>
    </Link>
  );
};

export default RecipeCard;
