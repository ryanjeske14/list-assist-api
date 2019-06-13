BEGIN;

TRUNCATE
    recipes_ingredients,
    recipes,
    units,
    ingredients,
    users 
    RESTART IDENTITY CASCADE;

INSERT INTO ingredients (name)
VALUES
    ('bonless skinless chicken thighs'),
    ('yellow onions'),
    ('garlic cloves'),
    ('diced tomatoes, zesty chili style (14 oz)'),
    ('diced tomatoes and green chilies (10 oz)'),
    ('tomato puree (10 oz)'),
    ('chicken broth'),
    ('chile molido puro powder'),
    ('cumin'),
    ('oregano'),
    ('pinto beans (15 oz');

INSERT INTO units (name)
VALUES
    (''),
    ('teaspoons'),
    ('tablespoons'),
    ('ounces'),
    ('cups'),
    ('pints'),
    ('quarts'),
    ('gallons'),
    ('milliliters'),
    ('liters'),
    ('cans'),
    ('bottles'),
    ('pinches'),
    ('dashes'),
    ('grams'),
    ('lbs'),
    ('packages'),
    ('loaves'),
    ('slices');

INSERT INTO users (user_name, password)
VALUES
    ('dummy', 'password');

INSERT INTO recipes (name, instructions, owner_id)
VALUES
    ('Pulled Chicken Chili',
        '- Put chicken on bottom of crockpot and turn on
        - Sautee garlic and onions and put on top of chicken 
        - Pour in canned tomatoes and chicken broth and add spices. Stir together. 
        - Once done cooking, remove chicken and pull apart with two forks. Replace chicken. 
        - Add beans, stir, and let cook another 15 minutes',
    1);

INSERT INTO recipes_ingredients (recipe_id, ingredient_id, quantity, unit_id, special_instructions)
VALUES
    (1, 1, 2, 16, ''),
    (1, 2, 1, 1, 'chopped'),
    (1, 3, 4, 1, 'minced'),
    (1, 4, 1, 11, ''),
    (1, 5, 1, 11, ''),
    (1, 6, 1, 11, ''),
    (1, 7, 1, 5, ''),
    (1, 8, 2, 3, ''),
    (1, 9, 1, 2, ''),
    (1, 10, 1, 2, ''),
    (1, 11, 2, 11, '');

COMMIT;
