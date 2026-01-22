import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe, handleDeleteRecipe }) => {
  return (
    <Link
      key={recipe._id}
      to={`/recipes/detail/${recipe._id}`}
      className="home-recipe-card block hover:shadow-lg transition-shadow rounded-lg p-4"
    >
      <div className="flex-between mb-2">
        <h4 className="text-lg font-semibold line-clamp-1">{recipe.title}</h4>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // empêche la navigation si on clique sur le trash
            handleDeleteRecipe(recipe._id);
          }}
          className="text-slate-500 hover:text-red-400"
        >
          <FaTrash />
        </button>
      </div>

      {recipe.description && (
        <p className="text-sm text-slate-400 line-clamp-2 mb-2">
          {recipe.description}
        </p>
      )}

      <p className="text-xs text-slate-500">
        Créée le {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
        {recipe.authorEmail && ` — publié par ${recipe.authorEmail}`}
      </p>
    </Link>
  );
};

export default RecipeCard;
