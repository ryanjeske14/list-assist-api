const RecipesService = {
  getAllRecipes(db) {
    return db.raw(`select json_agg(rec)
        from (
            select r.id, r.name, r.description, r.instructions, r.owner_id,
            (select json_agg(recing)
            from (
                select ingredient_id as id, i.name, quantity, u.name as unit, special_instructions, recipe_id from recipes_ingredients 
                join ingredients i on ingredient_id = i.id
                join units u on unit_id = u.id
                where recipe_id = r.id
                ) recing
            ) as ingredients
            from recipes as r) as rec
        `);
  },

  getById(db, id) {
    return db.raw(`select r.id, r.name, r.description, r.instructions,
    (select json_agg(recing)
    from (
      select ingredient_id as id, i.name, quantity, u.name as unit, special_instructions, recipe_id from recipes_ingredients 
      join ingredients i on ingredient_id = i.id
      join units u on unit_id = u.id
      where recipe_id = r.id
      ) recing
    ) as ingredients
    from recipes r
    where r.id = ${id}`);
  },

  insertRecipe(db, ingredients, newRecipe, recipeIngredients) {
    let newRecipeId;
    return db
      .transaction(async trx => {
        await trx
          .into("ingredients")
          .insert(ingredients)
          .returning("*")
          .then(ingredients => {
            for (let recipeIngredient of recipeIngredients) {
              for (let ingredient of ingredients) {
                if (recipeIngredient.name === ingredient.name) {
                  recipeIngredient.ingredient_id = ingredient.id;
                  delete recipeIngredient.name;
                }
              }
            }
          });
        await trx
          .into("recipes")
          .insert(newRecipe)
          .returning("id")
          .then(([recipeId]) => recipeId)
          .then(recipeId => {
            for (let recipeIngredient of recipeIngredients) {
              recipeIngredient.recipe_id = recipeId;
            }
            newRecipeId = recipeId;
          });
        await trx.into("recipes_ingredients").insert(recipeIngredients);
      })
      .then(() => {
        return RecipesService.getById(db, newRecipeId);
      });
  }
};

module.exports = RecipesService;
