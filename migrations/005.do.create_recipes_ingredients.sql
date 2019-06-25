CREATE TABLE recipes_ingredients (
    recipe_id INTEGER REFERENCES recipes(id) ON DELETE CASCADE,
    ingredient_id INTEGER REFERENCES ingredients(id) ON DELETE CASCADE,
    quantity REAL NOT NULL,
    unit_id INTEGER REFERENCES units(id),
    special_instructions TEXT,
    PRIMARY KEY (recipe_id, ingredient_id)
);