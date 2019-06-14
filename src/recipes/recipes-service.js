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
  }
};

module.exports = RecipesService;
