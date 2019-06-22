const express = require("express");
const path = require("path");
const RecipesService = require("./recipes-service");
const { requireAuth } = require("../middleware/jwt-auth");

const recipesRouter = express.Router();
const jsonBodyParser = express.json();

recipesRouter.route("/").get((req, res, next) => {
  const userId = req.headers.userid || 0;
  RecipesService.getRecipes(req.app.get("db"), userId)
    .then(recipes => {
      if (recipes.rows[0].json_agg != null) {
        res.json(recipes.rows[0].json_agg.map(RecipesService.serializeRecipe));
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
      quantity: convertFraction(ingredient.quantity),
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

recipesRouter
  .route("/:recipe_id")
  .all(requireAuth)
  .all(checkRecipeExists)
  .get((req, res, next) => {
    res.json(RecipesService.serializeRecipe(res.recipe));
  })
  .delete(requireAuth, (req, res, next) => {
    const recipe = res.recipe;

    if (req.user.id != recipe.owner_id) {
      return res.status(401).json({
        error: {
          message: "Unauthorized request: You may only delete your own recipes!"
        }
      });
    }

    RecipesService.deleteRecipe(req.app.get("db"), req.params.recipe_id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

async function checkRecipeExists(req, res, next) {
  try {
    const recipe = await RecipesService.getById(
      req.app.get("db"),
      req.params.recipe_id
    );

    if (!recipe.rows[0])
      return res.status(404).json({
        error: `Recipe doesn't exist`
      });

    res.recipe = recipe.rows[0];
    next();
  } catch (error) {
    next(error);
  }
}

const convertFraction = num => {
  if (num.includes("/")) {
    let splitNum = num.split("/").map(num => parseInt(num));
    return splitNum[0] / splitNum[1];
  } else {
    return num;
  }
};

module.exports = recipesRouter;
