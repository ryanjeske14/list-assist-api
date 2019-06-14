const express = require("express");
const RecipesService = require("./recipes-service");

const recipesRouter = express.Router();

recipesRouter.route("/").get((req, res, next) => {
  RecipesService.getAllRecipes(req.app.get("db"))
    .then(recipes => {
      res.json(recipes.rows[0].json_agg);
    })
    .catch(next);
});

module.exports = recipesRouter;
