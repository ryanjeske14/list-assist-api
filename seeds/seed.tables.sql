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
    ('pinto beans (15 oz)'),
    ('boneless skinless chicken breasts'),
    ('dry ranch dressing packet'),
    ('buffalo wing sauce (12 oz)');

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

INSERT INTO recipes (name, description, instructions, owner_id)
VALUES
    ('Pulled Chicken Chili',
        'Delicious and hearty chili recipe, great for those trying to cut down on red meat consumption!',
        '- Put chicken on bottom of crockpot and turn on
        - Sautee garlic and onions and put on top of chicken 
        - Pour in canned tomatoes and chicken broth and add spices. Stir together. 
        - Once done cooking, remove chicken and pull apart with two forks. Replace chicken. 
        - Add beans, stir, and let cook another 15 minutes',
    1),
    ('Buffalo Chicken Dip',
    'Crockpot Buffalo Chicken Dip- Juicy and delicious buffalo chicken cooked to perfection with the help of your crockpot.',
    '- Place chicken breasts in the bottom of your crockpot. 
    - Sprinkle with ranch seasoning then pour buffalo wing sauce over the top. 
    - Cook chicken on low for 6-8 hours or on high for 4-5 hours.',
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
    (1, 11, 2, 11, ''),
    (2, 12, 2, 16, ''),
    (2, 13, 1, 1, ''),
    (2, 14, 1, 12, '');

COMMIT;
