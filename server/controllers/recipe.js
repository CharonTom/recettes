const Recipe = require("../models/recipe");

// Créer une recette
exports.createRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      serves,
      authorEmail,
    } = req.body;

    if (!title || !ingredients || !steps) {
      return res
        .status(400)
        .json({ message: "Titre, ingrédients et étapes sont obligatoires" });
    }

    const recipe = await Recipe.create({
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      serves,
      author: req.user.id,
      authorEmail: req.user.email,
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la création" });
  }
};

// Récupérer toutes les recettes de l'utilisateur connecté
exports.getMyRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find({ author: req.user.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération" });
  }
};

// Récupérer une recette par id
exports.getRecipeById = async (req, res) => {
  try {
    const recipe = await Recipe.findOne({
      _id: req.params.id,
      author: req.user.id,
    });
    if (!recipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }
    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la récupération" });
  }
};

// Mettre à jour une recette
exports.updateRecipe = async (req, res) => {
  try {
    const {
      title,
      description,
      ingredients,
      steps,
      prepTime,
      cookTime,
      serves,
      isFavorite,
      authorEmail,
    } = req.body;

    const recipe = await Recipe.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      {
        title,
        description,
        ingredients,
        steps,
        prepTime,
        cookTime,
        serves,
        isFavorite,
        authorEmail,
      },
      { new: true, runValidators: true }
    );

    if (!recipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }

    res.status(200).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la mise à jour" });
  }
};

// Supprimer une recette
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findOneAndDelete({
      _id: req.params.id,
      author: req.user.id,
    });

    if (!recipe) {
      return res.status(404).json({ message: "Recette introuvable" });
    }

    res.status(200).json({ message: "Recette supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de la suppression" });
  }
};
