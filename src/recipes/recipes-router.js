const express = require("express");
const path = require("path");
const RecipesService = require("./recipes-service");
const { requireAuth } = require("../middleware/jwt-auth");
const recipesRouter = express.Router();
const jsonBodyParser = express.json();

recipesRouter.route("/").get((req, res, next) => {
  const userId = req.headers.userid || 0;
  // get default recipes and recipes for current user
  RecipesService.getRecipes(req.app.get("db"), userId)
    .then(recipes => {
      // because of the format of query results from using json_agg in SQL statement, desired data is stored at recipes.rows[0].json_agg
      if (recipes.rows[0].json_agg != null) {
        res.json(recipes.rows[0].json_agg.map(RecipesService.serializeRecipe));
      } else res.json([]);
    })
    .catch(next);
});

recipesRouter.route("/").post(requireAuth, jsonBodyParser, (req, res, next) => {
  const { recipe } = req.body;
  // set ingredients variable as array containing ingredient names from recipe in request body
  const ingredients = recipe.ingredients.map(ingredient => {
    return { name: ingredient.name };
  });
  // set newRecipe variable as object containing recipe data from recipe in request body
  const newRecipe = {
    name: recipe.name,
    description: recipe.description,
    instructions: recipe.instructions
  };
  // set recipeIngredients variable as array containing ingredient data for each ingredient from recipe in request body
  const recipeIngredients = recipe.ingredients.map(ingredient => {
    return {
      // convert fraction values to decimal values to be stored in DB
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

  // pass DB connection and recipe data to insertRecipe function
  RecipesService.insertRecipe(
    req.app.get("db"),
    ingredients,
    newRecipe,
    recipeIngredients
  )
    // get result => if successful, return result, else return empty object
    .then(result => {
      if (result.rows[0] != null) {
        return result.rows[0];
      } else return {};
    })
    // send 201 response with location and new recipe data
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
  .all(checkRecipeExists)
  // endpoint to get data for specific recipe, and return serialized result (to prevent XSS attack)
  .get((req, res, next) => {
    res.json(RecipesService.serializeRecipe(res.recipe));
  })
  // endpoint to delete specific recipe
  .delete(requireAuth, jsonBodyParser, (req, res, next) => {
    const recipe = res.recipe;

    // only allow users to delete their own recipes, and not other users' recipes
    if (req.user.id != recipe.owner_id) {
      return res.status(401).json({
        error: {
          message: "Unauthorized request: You may only delete your own recipes!"
        }
      });
    }

    // store IDs or all ingredients associated with specific recipe to be deleted from DB
    const ingredientIds = recipe.ingredients.map(ingredient => {
      return ingredient.id;
    });

    RecipesService.deleteRecipe(
      req.app.get("db"),
      req.params.recipe_id,
      ingredientIds
    )
      // if delete request successful, respond with 204
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .patch(requireAuth, jsonBodyParser, (req, res, next) => {
    const { recipe, ingredientsToDelete } = req.body;

    // only allow users to modify their own recipes, and not other users' recipes
    if (req.user.id != recipe.owner_id) {
      return res.status(401).json({
        error: {
          message: "Unauthorized request: You may only edit your own recipes!"
        }
      });
    }

    // extract ingredient data (id and name of each ingredient) and assign to array
    const ingredients = recipe.ingredients.map(ingredient => {
      return { id: ingredient.id, name: ingredient.name };
    });
    // extract recipe data (id, name, description, and instructions) and assign to object
    const updatedRecipe = {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      instructions: recipe.instructions
    };
    // extract recipeIngredients data (recipe_id, quantity, unit_id, and special instructions) and assign to array
    const recipeIngredients = recipe.ingredients.map(ingredient => {
      return {
        recipe_id: recipe.id,
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

    // initiate request to update the recipe, passing in above variables as arguments
    RecipesService.updateRecipe(
      req.app.get("db"),
      ingredients,
      updatedRecipe,
      recipeIngredients,
      ingredientsToDelete
    )
      // if patch request successful, respond with 204
      .then(numRowsAffected => {
        res.status(204).end();
      })
      .catch(next);
  });

// middleware to check if specific recipe exists in DB
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
  // if num includes '/', convert fraction value to decimal
  if (num.includes("/")) {
    let splitNum = num.split("/").map(num => parseInt(num));
    return splitNum[0] / splitNum[1];
  } else {
    return num;
  }
};

module.exports = recipesRouter;
