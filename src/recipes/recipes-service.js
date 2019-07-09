const xss = require("xss");

const RecipesService = {
  // retrieve recipes with owner_id matching either admin ID (1) or current user ID
  getRecipes(db, userId) {
    return db.raw(`select json_agg(rec)
        from (
            select r.id, r.name, r.description, r.instructions, r.owner_id,
            (select json_agg(recing)
            from (
                select ingredient_id as id, i.name, quantity, u.name as unit, u.id as unit_id, special_instructions, recipe_id from recipes_ingredients 
                join ingredients i on ingredient_id = i.id
                join units u on unit_id = u.id
                where recipe_id = r.id
                ) recing
            ) as ingredients
            from recipes as r where r.owner_id = ${userId} or r.owner_id = 1) as rec
        `);
  },

  // retrieve recipe data for specific recipe
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

  // insert data from post request into ingredients, recipes, and recipes_ingredients tables
  insertRecipe(db, ingredients, newRecipe, recipeIngredients) {
    let newRecipeId;
    return (
      db
        // using a transaction with async/await in order to ensure proper order of data submission based on dependencies
        // transaction will rollback if an error occurs at any point in the process to prevent incomplete data insertion
        .transaction(async trx => {
          // insert ingredients data, and for each ingredient, assign id returned from database to associated recipeIngredients entry
          await trx
            .into("ingredients")
            .insert(ingredients)
            .returning("*")
            .then(ingredients => {
              for (let i = 0; i < ingredients.length; i++) {
                recipeIngredients[i].ingredient_id = ingredients[i].id;
              }
            });
          // insert recipe data, and assign recipe_id returned from database to each entry in recipeIngredients
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
          // insert recipeIngredients data
          await trx.into("recipes_ingredients").insert(recipeIngredients);
        })
        // query database for recipe data based on new recipe ID and return response
        .then(() => {
          return RecipesService.getById(db, newRecipeId);
        })
    );
  },

  // delete specific recipe and associated ingredients from recipes and ingredients tables
  deleteRecipe(db, id, ingredientIds) {
    // using a transaction and async/await to ensure proper order of data deletion based on dependencies
    // transaction will rollback if error occurs at any point in the process to prevent incomplete data deletion
    // associated data in recipes_ingredients table is deleted due to ON DELETE CASCADE setting
    return db.transaction(async trx => {
      try {
        await trx("recipes")
          .where({ id })
          .delete();
        await trx("ingredients")
          .whereIn("id", ingredientIds)
          .delete();
        trx.commit;
      } catch {
        trx.rollback;
      }
    });
  },

  updateRecipe(
    db,
    ingredients,
    recipe,
    recipeIngredients,
    ingredientsToDelete
  ) {
    // using a transaction and async/await to ensure proper order of execution based on dependencies
    // transaction will rollback if error occurs at any point in the process to prevent incomplete/invalid data manipulation
    return db.transaction(async trx => {
      try {
        // delete ingredients associated with recipe being modified
        await trx("ingredients")
          .whereIn(
            "id",
            ingredientsToDelete
              .filter(ingredient => ingredient.id)
              .map(ingredient => ingredient.id)
          )
          .delete();
        // insert new list of ingredients, and for each ingredient, assign id returned from database to associated recipeIngredients entry
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
        // update recipe data for specified recipe
        await db("recipes")
          .where("id", recipe.id)
          .update({
            name: recipe.name,
            description: recipe.description,
            instructions: recipe.instructions
          });
        // insert recipeIngredients data
        await trx.into("recipes_ingredients").insert(recipeIngredients);
        trx.commit;
      } catch {
        trx.rollback;
      }
    });
  },

  serializeRecipe(recipe) {
    // used to prevent XSS attacks by removing malicious, free-formatted code entered by user
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
