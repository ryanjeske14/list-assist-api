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
});
