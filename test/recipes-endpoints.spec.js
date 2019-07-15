const knex = require("knex");
const app = require("../src/app");
const helpers = require("./test-helpers");

describe("Recipes Endpoints", function() {
  let db;

  const {
    testUsers,
    testIngredients,
    testUnits,
    testRecipes,
    testRecipesIngredients
  } = helpers.makeRecipesFixtures();

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("cleanup", () => helpers.cleanTables(db));

  afterEach("cleanup", () => helpers.cleanTables(db));

  describe(`GET /api/recipes`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get("/api/recipes")
          .expect(200, []);
      });
    });

    context(`Given there are recipes in the database`, () => {
      beforeEach("insert recipes data", () =>
        helpers.seedRecipesTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testUnits,
          testRecipesIngredients
        )
      );

      it("responds with 200 and all of the recipes", () => {
        const expectedRecipes = testRecipes.map(recipe =>
          helpers.makeExpectedRecipe(
            testUsers,
            recipe,
            testRecipesIngredients,
            testIngredients,
            testUnits
          )
        );

        return supertest(app)
          .get("/api/recipes")
          .expect(200, expectedRecipes);
      });
    });
  });

  describe(`POST /api/recipes`, () => {
    beforeEach("insert recipes data", () =>
      helpers.seedRecipesTables(
        db,
        testUsers,
        testRecipes,
        testIngredients,
        testUnits,
        testRecipesIngredients
      )
    );

    it(`creates a new recipe, responding with 201 and the new recipe`, function() {
      const testUser = testUsers[0];
      const newRecipe = {
        recipe: {
          name: "Test Name",
          description: "Test Description",
          instructions: "Test Instructions",
          ingredients: [
            {
              name: "Ing 1",
              quantity: "3",
              unit_id: 1,
              special_instructions: "diced"
            },
            {
              name: "Ing 2",
              quantity: "1",
              unit_id: 2,
              special_instructions: ""
            }
          ]
        }
      };

      const ingredientResponse = [
        {
          id: 5,
          name: "Ing 1",
          quantity: 3,
          recipe_id: 4,
          special_instructions: "diced",
          unit: "Unit 1",
          unit_id: 1
        },
        {
          id: 6,
          name: "Ing 2",
          quantity: 1,
          recipe_id: 4,
          special_instructions: "",
          unit: "Unit 2",
          unit_id: 2
        }
      ];

      return supertest(app)
        .post("/api/recipes")
        .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
        .send(newRecipe)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property("id");
          expect(res.body.name).to.eql(newRecipe.recipe.name);
          expect(res.body.description).to.eql(newRecipe.recipe.description);
          expect(res.body.instructions).to.eql(newRecipe.recipe.instructions);
          expect(res.body.owner_id).to.eql(testUser.id);
          expect(res.body.ingredients).to.deep.equal(ingredientResponse);
        });
    });
  });
  describe(`GET /api/recipes/:recipe_id`, () => {
    context(`Given no recipes`, () => {
      beforeEach(() => helpers.seedUsers(db, testUsers));

      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(404, { error: `Recipe doesn't exist` });
      });
    });

    context("Given there are recipes in the database", () => {
      beforeEach("insert recipes", () =>
        helpers.seedRecipesTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testUnits,
          testRecipesIngredients
        )
      );

      it("responds with 200 and the specified recipe", () => {
        const recipeId = 2;
        const expectedRecipe = helpers.makeExpectedRecipe(
          testUsers,
          testRecipes[recipeId - 1],
          testRecipesIngredients,
          testIngredients,
          testUnits
        );

        return supertest(app)
          .get(`/api/recipes/${recipeId}`)
          .expect(200, expectedRecipe);
      });
    });
  });

  describe(`PATCH /api/recipes/:recipe_id`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .delete(`/api/recipes/${recipeId}`)
          .expect(404, { error: `Recipe doesn't exist` });
      });
    });

    context("Given there are recipes in the database", () => {
      beforeEach("insert recipes", () =>
        helpers.seedRecipesTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testUnits,
          testRecipesIngredients
        )
      );

      it("responds with 204 and updates the recipe", () => {
        const idToUpdate = 2;
        const testUser = testUsers[0];
        const updatedRecipe = {
          recipe: {
            id: idToUpdate,
            name: "Test mod",
            description: "Test mod",
            instructions: "Test mod",
            owner_id: testUser.id,
            ingredients: [
              {
                id: 4,
                name: "Ing mod",
                quantity: "1",
                unit: "Unit 1",
                unit_id: 1,
                special_instructions: "diced mod",
                recipe_id: 2
              },
              {
                id: 3,
                name: "Ing mod",
                quantity: "1",
                unit: "Unit 2",
                unit_id: 2,
                special_instructions: "",
                recipe_id: 2
              }
            ]
          },
          ingredientsToDelete: [{ id: 4 }, { id: 3 }]
        };
        const expectedRecipe = {
          id: 2,
          name: "Test mod",
          description: "Test mod",
          instructions: "Test mod",
          owner_id: testUser.id,
          ingredients: [
            {
              id: 5,
              name: "Ing mod",
              quantity: 1,
              unit: "Unit 1",
              unit_id: 1,
              special_instructions: "diced mod",
              recipe_id: 2
            },
            {
              id: 6,
              name: "Ing mod",
              quantity: 1,
              unit: "Unit 2",
              unit_id: 2,
              special_instructions: "",
              recipe_id: 2
            }
          ]
        };
        return supertest(app)
          .patch(`/api/recipes/${idToUpdate}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .send(updatedRecipe)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/recipes/${idToUpdate}`)
              .expect(expectedRecipe)
          );
      });
    });
  });

  describe(`DELETE /api/recipes/:recipe_id`, () => {
    context(`Given no recipes`, () => {
      it(`responds with 404`, () => {
        const recipeId = 123456;
        return supertest(app)
          .delete(`/api/recipes/${recipeId}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Recipe doesn't exist` });
      });
    });

    context("Given there are recipes in the database", () => {
      beforeEach("insert recipes", () =>
        helpers.seedRecipesTables(
          db,
          testUsers,
          testRecipes,
          testIngredients,
          testUnits,
          testRecipesIngredients
        )
      );

      it("responds with 204 and removes the recipe", () => {
        const idToRemove = 2;
        const expectedRecipes = testRecipes
          .map(recipe =>
            helpers.makeExpectedRecipe(
              testUsers,
              recipe,
              testRecipesIngredients,
              testIngredients,
              testUnits
            )
          )
          .filter(recipe => recipe.id !== idToRemove);

        return supertest(app)
          .delete(`/api/recipes/${idToRemove}`)
          .set("Authorization", helpers.makeAuthHeader(testUsers[0]))
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/recipes`)
              .then(res => {
                expect(res.body.length).to.equal(2);
                expect(res.body.find(recipe => recipe.id === 2)).to.equal(
                  undefined
                );
              })
          );
      });
    });
  });
});
