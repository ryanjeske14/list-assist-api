CREATE TABLE recipes_ingredients (
    recipe_id INTEGER REFERENCES recipes(id),
    ingredient_id INTEGER REFERENCES ingredients(id),
    quantity REAL NOT NULL,
    unit_id INTEGER REFERENCES units(id),
    special_instructions TEXT,
    PRIMARY KEY (recipe_id, ingredient_id)
);