const xss = require("xss");

const RecipesService = {
  getRecipes(db, userId) {
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
            from recipes as r where r.owner_id = ${userId} or r.owner_id = 1) as rec
        `);
  },

  getById(db, id) {
    return db.raw(`select r.id, r.name, r.description, r.instructions, r.owner_id,
    (select json_agg(recing)
    from (
      select ingredient_id as id, i.name, quantity, u.name as unit, u.id as unit_id, special_instructions, recipe_id from recipes_ingredients 
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
            for (let i = 0; i < ingredients.length; i++) {
              recipeIngredients[i].ingredient_id = ingredients[i].id;
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
  },

  deleteRecipe(db, id) {
    return db("recipes")
      .where({ id })
      .delete();
  },

  updateRecipe(
    db,
    ingredients,
    recipe,
    recipeIngredients,
    ingredientsToDelete
  ) {
    return db.transaction(async trx => {
      try {
        await trx("ingredients")
          .whereIn(
            "id",
            ingredientsToDelete
              .filter(ingredient => ingredient.id)
              .map(ingredient => ingredient.id)
          )
          .delete();
        await trx
          .into("ingredients")
          .insert(
            ingredients.map(ingredient => {
              return { name: ingredient.name };
            })
          )
          .returning("*")
          .then(ingredients => {
            for (let i = 0; i < ingredients.length; i++) {
              recipeIngredients[i].ingredient_id = ingredients[i].id;
            }
          });
        await db("recipes")
          .where("id", recipe.id)
          .update({
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions
          });
        await trx.into("recipes_ingredients").insert(recipeIngredients);
        trx.commit;
      } catch {
        console.log("shit");
        trx.rollback;
      }
    });
  },

  serializeRecipe(recipe) {
    return {
      id: recipe.id,
      name: xss(recipe.name),
      description: xss(recipe.description),
      instructions: xss(recipe.instructions),
      owner_id: recipe.owner_id,
      ingredients: recipe.ingredients.map(ingredient => {
        return {
          id: ingredient.id,
          name: xss(ingredient.name),
          quantity: ingredient.quantity,
          unit: ingredient.unit,
          unit_id: ingredient.unit_id,
          special_instructions: xss(ingredient.special_instructions),
          recipe_id: ingredient.recipe_id
        };
      })
    };
  }
};

module.exports = RecipesService;
