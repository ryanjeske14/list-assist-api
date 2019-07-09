# LIST ASSIST

A full stack web app that automates grocery list preparation by providing users with consolidated, system-generated grocery lists based on their selection from both default and custom recipes.

## Demo:

- [List Assist Live App](https://ryanjeske-list-assist.now.sh/)

## List Assist API Endpoints:

### getRecipes (public)
#### Description:
Responds with all default and user-added recipes. Note that in order to get user-added recipes, a valid auth token must be provided using the Authorization header (e.g., 'Bearer YOUR-AUTH-TOKEN'). Users are only able to view their own recipes, and cannot see recipes added by other users. 
#### Endpoint URL:
https://obscure-island-22700.herokuapp.com/api/recipes
#### HTTP Request Method:
GET

### getById (public)
#### Description:
Responds with data for recipe specified by /:recipe_id in Endpoint URL. 
#### Endpoint URL:
https://obscure-island-22700.herokuapp.com/api/recipes/:recipe_id
#### Example URL:
https://obscure-island-22700.herokuapp.com/api/recipes/2
#### HTTP Request Method:
GET

### insertRecipe (protected)
#### Description:
Used to create a new recipe. A valid auth token must be provided using the Authorization header (e.g., 'Bearer YOUR-AUTH-TOKEN'). 
#### Endpoint URL:
https://obscure-island-22700.herokuapp.com/api/recipes
#### HTTP Request Method:
POST

### deleteRecipe (protected)
#### Description:
Deletes recipe specified by /:recipe_id in Endpoint URL. A valid auth token must be provided using the Authorization header (e.g., 'Bearer YOUR-AUTH-TOKEN'). Users are only able to delete their own recipes, and cannot delete recipes added by other users. 
#### Endpoint URL:
https://obscure-island-22700.herokuapp.com/api/recipes/:recipe_id
#### Example URL:
https://obscure-island-22700.herokuapp.com/api/recipes/2
#### HTTP Request Method:
DELETE

#### updateRecipe (protected)
##### Description:
Modifies recipe and associated ingredients specified by /:recipe_id in Endpoint URL. A valid auth token must be provided using the Authorization header (e.g., 'Bearer YOUR-AUTH-TOKEN'). Users are only able to edit their own recipes, and cannot edit recipes added by other users. 
##### Endpoint URL:
https://obscure-island-22700.herokuapp.com/api/recipes/:recipe_id
##### Example URL:
https://obscure-island-22700.herokuapp.com/api/recipes/2
##### HTTP Request Method:
PATCH

## Built With

* Node.js
* Express
* PostgreSQL

## Client Repo:

- [List Assist](https://github.com/ryanjeske14/list-assist)
