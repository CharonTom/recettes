const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    ingredients: [{ type: String, required: true }],
    steps: [{ type: String, required: true }],
    prepTime: { type: Number, default: 0 }, // minutes
    cookTime: { type: Number, default: 0 }, // minutes
    serves: { type: Number, default: 1 },
    isFavorite: { type: Boolean, default: false },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Recipe", recipeSchema);
