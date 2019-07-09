# LIST ASSIST

A full stack web app that automates grocery list preparation by providing users with consolidated, system-generated grocery lists based on their selection from both default and custom recipes.

## Demo:

- [Live Demo](https://ryanjeske-list-assist.now.sh/)

## API Structure and Endpoints:

### Structure: 

### Endpoints: 

#### Method: getRecipes (public)
##### Endpoint URL:
https://obscure-island-22700.herokuapp.com/api/recipes
##### Description:
Responds with all default and user-added recipes. Note that in order to get user-added recipes, a valid auth token must be provided using the Authorization header (e.g., 'Bearer YOUR-AUTH-TOKEN'). Users are only able to view their own recipes, and cannot see recipes added by other users. 


## Built With

### Server-Side
* Node.js
* Express
* PostgreSQL

### Client-Side Repo:

- [List Assist](https://github.com/ryanjeske14/list-assist)
