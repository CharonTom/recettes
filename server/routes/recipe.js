const express = require("express");
const router = express.Router();
const recipeController = require("../controllers/recipe");
const auth = require("../middleware/auth");

// Toutes les routes recettes sont protégées par le middleware d'auth
router.use(auth);

router.get("/", recipeController.getMyRecipes);
router.post("/", recipeController.createRecipe);
router.get("/:id", recipeController.getRecipeById);
router.put("/:id", recipeController.updateRecipe);
router.delete("/:id", recipeController.deleteRecipe);

module.exports = router;
