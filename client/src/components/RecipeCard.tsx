import { FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const RecipeCard = ({ recipe, handleDeleteRecipe }) => {
  return (
    <Link
      key={recipe._id}
      to={`/recipes/detail/${recipe._id}`}
      className="block w-80 h-40 hover:shadow-lg transition-shadow rounded-lg p-4 bg-white border relative"
    >
      <div className="">
        <h4 className="">{recipe.title}</h4>
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault(); // empêche la navigation si on clique sur le trash
            handleDeleteRecipe(recipe._id);
          }}
          className="text-slate-500 hover:text-red-400 absolute top-4 right-4"
        >
          <FaTrash />
        </button>
      </div>

      {recipe.description && (
        <p className="text-sm text-slate-400 line-clamp-2 mb-2">
          {recipe.description}
        </p>
      )}

      <p className="text-xs text-slate-500 absolute bottom-4">
        Créée le {new Date(recipe.createdAt).toLocaleDateString("fr-FR")}
        {recipe.author && ` — publié par ${recipe.author.name}`}
      </p>
    </Link>
  );
};

export default RecipeCard;
