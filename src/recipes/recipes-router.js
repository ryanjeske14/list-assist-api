const express = require("express");
const path = require("path");
const RecipesService = require("./recipes-service");
const { requireAuth } = require("../middleware/jwt-auth");

const recipesRouter = express.Router();
const jsonBodyParser = express.json();

recipesRouter.route("/").get((req, res, next) => {
  const userId = req.headers.userid;
  RecipesService.getRecipes(req.app.get("db"), userId)
    .then(recipes => {
      if (recipes.rows[0].json_agg != null) {
        res.json(recipes.rows[0].json_agg);
      } else res.json([]);
    })
    .catch(next);
});

recipesRouter.route("/").post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { recipe } = req.body;
  const ingredients = recipe.ingredients.map(ingredient => {
    return { name: ingredient.name };
  });
  const newRecipe = {
    name: recipe.name,
    description: recipe.description,
    instructions: recipe.instructions
  };
  const recipeIngredients = recipe.ingredients.map(ingredient => {
    return {
      name: ingredient.name,
      quantity: ingredient.quantity,
      unit_id: ingredient.unit_id,
      special_instructions: ingredient.special_instructions
    };
  });

  for (const [key, value] of Object.entries(recipe))
    if (value == null)
      return res.status(400).json({
        error: `Missing '${key}' in request body`
      });

  newRecipe.owner_id = req.user.id;

  RecipesService.insertRecipe(
    req.app.get("db"),
    ingredients,
    newRecipe,
    recipeIngredients
  )
    .then(result => {
      if (result.rows[0] != null) {
        return result.rows[0];
      } else return {};
    })
    .then(recipe => {
      res
        .status(201)
        .location(path.posix.join(req.originalUrl, `/${recipe.id}`))
        .json(recipe);
    })
    .catch(next);
});

module.exports = recipesRouter;
