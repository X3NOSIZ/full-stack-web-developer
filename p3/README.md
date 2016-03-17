
# Full Stack Nanodegree Project 3

## Database

Database is powered by [Firebase](https://firebaseio.com), a real-time NOSQL database.

Firebase handles authentication and security.

## Web Server

Node.js express app serves the static content for the app (.html, .css, and .js files).

## Client

All of the business logic is implemented on the client using [Angular](https://angularjs.org/).

## Security

Firebase security rules are used to restrict access of data to the appropriate users.

# Getting Started

## Packages

This project uses `npm` to manage dependencies.

1. Install [Node](https://nodejs.org/).
2. From the top level project directory, enter `npm start`.
3. Once the Bower and Node packages are installed and the server is listening on port 8080, navigate to [http://localhost:8080/](http://localhost:8080/) to access the app.

## Security Rules

To recompile the Firebase security rules:

```
blaze rules.yaml
```

# Functionality

## Authentication

* The app utilizes a simple email/password based authentication scheme.
* If the user forgets her password, she may reset it.
* At this time, the app does not provide a means of changing the password once reset.
* The app also allows authenticating with Google Plus for added security.

## Item Catalog Management

* Categories are fixed and are maintained by the admin.
* Once a user is logged in, she may:
  * ...add items to any category.
  * ...remove items she previously added.
  * ...edit items she previously added.
* An item must have a title and a description, and it must be associated with a category. An item may optionally include a picture.
* The app automatically tracks the creator and creation instant of items, which determine whether a user can edit/remove an existing item and what shows up in the latest items list respectively.

# Routes

## /

Displays the latest 10 items ordered by their creation instants (UTC).

## /catalog/{category\_name}/items

Displays the items in the category with name *{category_name}*.

## /catalog/{category\_name}/{item\_title}

Displays details for the item with a title of *{item_title}* in the category with name *{category_name}*.

This implies that an item's title must be unique at the category level (a constraint enforced by the app).

# Endpoints

## /catalog.json

This endpoint is not used by the app but is included to meet the specifications of the project.
