const express = require("express");
const RecipesService = require("./recipes-service");

const recipesRouter = express.Router();

recipesRouter.route("/").get((req, res, next) => {
  RecipesService.getAllRecipes(req.app.get("db"))
    .then(recipes => {
      if (recipes.rows[0].json_agg != null) {
        res.json(recipes.rows[0].json_agg);
      } else res.json([]);
    })
    .catch(next);
});

module.exports = recipesRouter;
