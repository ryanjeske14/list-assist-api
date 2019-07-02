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
    ('spaghetti'),
    ('extra-virgin olive oil'),
    ('unsalted butter'),
    ('medium shallots'),
    ('garlic'),
    ('tomato paste'),
    ('gochujang'),
    ('chicken stock'),
    ('heavy cream'),
    ('Kosher salt'),
    ('black pepper'),
    ('Parmesan cheese'),
    ('sesame seeds'),
    ('ground beef'),
    ('ground pork'),
    ('eggs'),
    ('plain breadcrumbs'),
    ('whole milk'),
    ('Parmesan cheese'),
    ('parsley'),
    ('oregano'),
    ('crushed Calabrian chilies in oil'),
    ('crushed red pepper flakes'),
    ('Kosher salt'),
    ('black pepper'),
    ('Italian rolls (6-inch)'),
    ('marinara sauce'),
    ('part-skim mozzarella'),
    ('provolone cheese'),
    ('light brown sugar'),
    ('mirin'),
    ('low-sodium soy sauce'),
    ('boneless, skinless chicken thighs'),
    ('sesame seeds'),
    ('hearts of romaine'),
    ('chow mein noodles'),
    ('bean sprouts'),
    ('green onions'),
    ('sesame oil'),
    ('rice vinegar');

INSERT INTO units (name)
VALUES
    (''), --1
    ('teaspoons'), --2
    ('tablespoons'), --3
    ('ounces'), --4
    ('cups'), --5
    ('pints'), --6
    ('quarts'), --7
    ('gallons'), --8
    ('milliliters'), --9 
    ('liters'), --10
    ('cans'), --11
    ('bottles'), --12
    ('pinches'), --13
    ('dashes'), --14
    ('grams'), --15
    ('pounds'), --16
    ('packages'), --17
    ('loaves'), --18
    ('slices'), --19
    ('cloves'); --20

INSERT INTO users (user_name, password)
VALUES
    ('ryanjeske', '$2a$12$Rj705fl1vn.g5YnpeHhyeuv/3f/AuX/WCUsdgJo0x14lDIRvMd6iO');

INSERT INTO recipes (name, description, instructions, owner_id)
VALUES
    ('Creamy Gochujang Noodles',
        'If you aren''t familiar with gochujang, it''s a Korean fermented chili paste that adds some sweet and savory heat to any dish. In this recipe it''s whisked together with a base of shallots, garlic, tomato paste and cream. It can be found in the Asian section of most grocery stores these days. Most of these ingredients are under $1.00 so it makes for a cheap meal that can feed multiple people.',
        'Bring a large pot of water to a boil. Pour in the pasta and cook, stirring occasionally, until al dente, about 8 to 10 minutes. Reserve 1 cup of the cooking liquid then drain the noodles and set aside. Toss the noodles with 1 tablespoon of the olive oil. 

        Return the pasta pot to medium heat, then add the remaining olive oil and heat through. Add the butter and allow to melt then add the shallots and saute, stirring occasionally, until tender, about 6 minutes. Add the garlic and saute until fragrant, just a few seconds. Stir in the tomato paste and gochujang, cooking for just 30 seconds to mellow the acidity. Whisk in the chicken stock until smooth then whisk in the cream and season to taste with salt and pepper. Add the pasta and toss to combine slowly; add the Parmesan until the sauce is smooth; add the pasta water 2 tablespoons at a time if the sauce is too clumpy. 

        Divide between warmed pasta bowls and serve hot. Top with sesame seeds (optional).
        
        Serves 4.',
    1),
    ('Meatball Subs with Spicy Beef and Pork Meatballs',
    'It''s Italian-American comfort food at its finest with beef meatballs slathered in sauce and broiled until the mozzarella cheese topping melts and oozes down the sides of the meatballs. The trick to building a perfect sub is starting with good meatballs, then adding them to good rolls of bread. The bread can make or break the sandwich - if it''s too soft then the sauce can cause it to turn mushy fast, and if it''s too hard then you may never even get a bite of the sandwich without a meatball popping out the side.  This recipe adds Calabrian chilies to the meatballs to add a little spice and flavor in each bite. Calabrian chilies can be found at gourmet markets or online. The recipe makes more meatballs than you will need for the sandwiches - freeze some for a night when you don''t feel like cooking.',
    'For the spicy beef and pork meatballs: 

Preheat oven to 425°F. 

Add the beef, pork, eggs, breadcrumbs, milk, Parmesan, parsley, oregano, Calabrian chilies, crushed red pepper, salt and pepper to the mixing bowl. Gently combine the mixture with your hands until all ingredients are just incorporated. 

 Roll the mixture into 1 1/2-ounce balls (about 1 1/2-inches in diameter) and place on a parchment-paper-lined baking sheet. Bake until golden brown and cooked through, about 20 minutes. 

Set meatballs aside until ready to assemble the sandwiches.

 

For assembly: 

Preheat oven to broil. 

Working one at a time, spoon 1/4 cup sauce into the roll then add three meatballs. Spoon another 1/4 to 1/3 cup of sauce over the top and alternate slices of the mozzarella and provolone over the top of the meatballs. Repeat with the remaining rolls and ingredients. 

Broil until the cheese is bubbly and the bread is golden brown, about 2 minutes. Serve immediately.

Makes 4 (6-inch) sandwiches (recipe makes about 2 1/2 dozen meatballs).',
    1),
    ('Crispy Teriyaki Chicken Salad',
    'Crispy, thinly sliced pieces of hearts of romaine lettuce are combined with sprouts, crispy chow mein noodles and green onions and tossed in a light and simple combination of sesame oil and rice vinegar. The homemade teriyaki sauce is free of any additional ingredients - just the traditional mixture of brown sugar, mirin and soy sauce simmered until a sticky sauce forms. This uncomplicated salad is perfect for an easy lunch.',
    'For the teriyaki sauce: 

In a small saucepan over medium heat bring the brown sugar, mirin and soy sauce to a boil, stirring until the sugar dissolves. Reduce the heat to low and simmer, stirring occasionally, until the sauce has thickened and reduced, about 30 to 40 minutes. Remove from heat and let cool. 

The sauce can be made up to 2 weeks ahead of time and refrigerated in an airtight container.

 

For the teriyaki chicken: 

Place the chicken thighs and half of the teriyaki sauce into a large resaelable plastic bag. Refrigerate for at least an hour and up to overnight. 

Remove the chicken from the marinade. Heat a large nonstick skillet to medium high. Add the chicken thighs to the pan and cook until completely cooked through, about 4 minutes on each side. Remove and slice the thighs and sprinkle with the sesame seeds. 

 

For the salad: 

In a large salad bowl toss together the romaine, chow mein noodles, sprouts, green onion, sesame oil and rice vinegar. Top the salad with the teriyaki chicken and drizzle with 2 tablespoons of the remaining sauce teriyaki sauce. 

 

Serves 4 as an entree.',
    1);

INSERT INTO recipes_ingredients (recipe_id, ingredient_id, quantity, unit_id, special_instructions)
VALUES
    (1, 1, 1, 16, ''),
    (1, 2, 3, 3, 'divided'),
    (1, 3, 2, 3, ''),
    (1, 4, 3, 1, 'diced'),
    (1, 5, 2, 20, 'minced'),
    (1, 6, 3, 3, ''),
    (1, 7, 2, 3, ''),
    (1, 8, 0.5, 5, ''),
    (1, 9, 0.5, 5, ''),
    (1, 10, 1, 2, 'to taste'),
    (1, 11, 1, 2, 'freshly ground, to taste'),
    (1, 12, 0.333333343, 5, 'grated'),
    (1, 13, 0.5, 2, '(optional)'),
    (2, 14, 1, 16, '(80% lean / 20% fat)'),
    (2, 15, 1, 16, ''),
    (2, 16, 2, 1, 'lightly beaten'),
    (2, 17, 1, 5, ''),
    (2, 18, 0.5, 5, ''),
    (2, 19, 0.333333343, 5, 'grated'),
    (2, 20, 2, 3, 'chopped flat leaf'),
    (2, 21, 1, 3, 'chopped'),
    (2, 22, 2, 2, ''),
    (2, 23, 0.25, 2, ''),
    (2, 24, 0.5, 2, ''),
    (2, 25, 0.25, 2, 'freshly ground'),
    (2, 26, 4, 1, 'sliced horizontally'),
    (2, 27, 3, 5, 'heated'),
    (2, 28, 6, 19, 'halved horizontally'),
    (2, 29, 6, 19, 'halved horizontally'),
    (3, 30, 1, 5, 'packed'),
    (3, 31, 1, 5, ''),
    (3, 32, 1, 5, ''),
    (3, 33, 4, 1, ''),
    (3, 34, 1, 2, ''),
    (3, 35, 3, 1, 'finely chopped'),
    (3, 36, 1.5, 5, ''),
    (3, 37, 1.5, 5, ''),
    (3, 38, 3, 1, 'thinly sliced'),
    (3, 39, 2, 3, ''),
    (3, 40, 2, 3, '');

COMMIT;
