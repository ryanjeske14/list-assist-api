function makeUsersArray() {
  return [
    {
      id: 1,
      username_name: "test-user-1",
      password: "password"
    },
    {
      id: 2,
      username_name: "test-user-2",
      password: "password"
    },
    {
      id: 3,
      username_name: "test-user-3",
      password: "password"
    }
  ];
}

function makeRecipesArray(users) {
  return [
    {
      id: 1,
      name: "Recipe 1",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      instructions:
        "Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque",
      owner_id: users[0].id
    },
    {
      id: 2,
      name: "Recipe 2",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      instructions:
        "Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque",
      owner_id: users[1].id
    },
    {
      id: 3,
      name: "Recipe 3",
      description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit.",
      instructions:
        "Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque",
      owner_id: users[2].id
    }
  ];
}

function makeIngredientsArray() {
  return [
    {
      id: 1,
      name: "Ingredient 1"
    },
    {
      id: 2,
      name: "Ingredient 2"
    },
    {
      id: 3,
      name: "Ingredient 3"
    },
    {
      id: 4,
      name: "Ingredient 4"
    }
  ];
}

function makeUnitsArray() {
  return [
    {
      id: 1,
      name: "Unit 1"
    },
    {
      id: 2,
      name: "Unit 2"
    },
    {
      id: 3,
      name: "Unit 3"
    },
    {
      id: 4,
      name: "Unit 4"
    }
  ];
}

function makeRecipesIngredientsArray() {
  return [
    {
      recipe_id: 1,
      ingredient_id: 1,
      quantity: 2,
      unit_id: 1,
      special_instructions: "Do some of this"
    },
    {
      recipe_id: 1,
      ingredient_id: 2,
      quantity: 1,
      unit_id: 2,
      special_instructions: "Do some of that"
    },
    {
      recipe_id: 1,
      ingredient_id: 3,
      quantity: 5,
      unit_id: 3,
      special_instructions: "Do some of this"
    },
    {
      recipe_id: 2,
      ingredient_id: 4,
      quantity: 2.5,
      unit_id: 2,
      special_instructions: "Do some of that"
    },
    {
      recipe_id: 2,
      ingredient_id: 3,
      quantity: 1,
      unit_id: 4,
      special_instructions: "Do some of this"
    },
    {
      recipe_id: 3,
      ingredient_id: 2,
      quantity: 4,
      unit_id: 2,
      special_instructions: "Do some of that"
    },
    {
      recipe_id: 3,
      ingredient_id: 1,
      quantity: 2,
      unit_id: 3,
      special_instructions: "Do some of this"
    }
  ];
}

function makeRecipesFixtures() {
  const testUsers = makeUsersArray();
  const testIngredients = makeIngredientsArray();
  const testUnits = makeUnitsArray();
  const testRecipes = makeRecipesArray(testUsers);
  const testRecipesIngredients = makeRecipesIngredientsArray();
  return {
    testUsers,
    testIngredients,
    testUnits,
    testRecipes,
    testRecipesIngredients
  };
}

const {
  testUsers,
  testIngredients,
  testUnits,
  testRecipes,
  testRecipesIngredients
} = makeRecipesFixtures();

const recipeIngredients = testRecipesIngredients.filter(
  ingredient => ingredient.recipe_id === 1
);

//console.log(recipeIngredients)
function makeExpectedRecipe(
  users,
  recipe,
  recipesIngredients,
  ingredients,
  units
) {
  const owner = users.find(user => user.id === recipe.owner_id);
  const ingredientsForRecipe = recipesIngredients.filter(
    ingredient => ingredient.recipe_id === recipe.id
  );

  return {
    id: recipe.id,
    name: recipe.name,
    description: recipe.description,
    instructions: recipe.instructions,
    owner_id: owner.id,
    ingredients: ingredientsForRecipe.map(ingredient => {
      return {
        id: ingredient.ingredient_id,
        name: ingredients.find(ing => ing.id === ingredient.ingredient_id).name,
        quantity: ingredient.quantity,
        unit: units.find(unit => unit.id === ingredient.ingredient_id).name,
        special_instructions: ingredient.special_instructions,
        recipe_id: ingredient.recipe_id
      };
    })
  };
}

//console.log(testRecipesIngredients)
console.log(
  makeExpectedRecipe(
    testUsers,
    testRecipes[0],
    testRecipesIngredients,
    testIngredients,
    testUnits
  )
);
