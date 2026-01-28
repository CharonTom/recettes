import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe, handleDeleteRecipe }) => {
  return (
    <Link
      key={recipe._id}
      to={`/recipes/detail/${recipe._id}`}
      className="recipe-card"
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
          className="text-slate-400 hover:text-red-400 absolute top-3 right-3 bg-white/90 rounded-full p-1 shadow-sm"
        >
          <FaTrash />
        </button>
        {recipe.description && (
          <p className="recipe-card-description mt-1">{recipe.description}</p>
        )}
      </div>

      <div className="px-4 pb-3">
        <p className="recipe-card-meta">
          Créée le {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
          {recipe.author && ` — par ${recipe.author.name}`}
        </p>
      </div>
    </Link>
  );
};

export default RecipeCard;
