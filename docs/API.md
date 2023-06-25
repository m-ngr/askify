# API Documentation

## Auth Endpoints

### Signup

- **Endpoint:** `/signup`
- **Method:** `POST`
- **Request Body:**

  User object with the required fields:

  - `firstName` (string): First name of the user.
  - `lastName` (string): Last name of the user.
  - `username` (string): Unique username for the user.
  - `email` (string): Email address of the user.
  - `password` (string): User's password.

- **Response:**

  `201 Created` status code with the following response body:

  - `user` (object): The created user object.
  - `token` (string): JWT token for authentication.

### Login

- **Endpoint:** `/login`
- **Method:** `POST`
- **Request Body:**

  User object with the required fields (`email`, `password`) or (`username` , `password`).

- **Response:**

  `200 OK` status code with the following response body:

  - `user` (object): The authenticated user object.
  - `token` (string): JWT token for authentication.

### Logout

- **Endpoint:** `/logout`
- **Method:** `POST`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Response:**

  `204 No Content` status code with the following response body:

  - `message` (string): Logout success message.

## Users Endpoints

### Search Users

- **Endpoint:** `/users`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Query Parameters:**
  - `query` (string): Search query for users.
- **Response:**
  - `200 OK` status code with a list of matched user objects in the response body.
    - `users` (array): List of matched user objects.

### Get User Profile

- **Endpoint:** `/users/profiles/:username`
- **Method:** `GET`
- **Response:**
  - `200 OK` status code with the user profile object in the response body.

### Get User Info

- **Endpoint:** `/users/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Response:**
  - `200 OK` status code with the user info object in the response body.

### Update User Info

- **Endpoint:** `/users/:id`
- **Method:** `PATCH`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Request Body:**

  **TEMP:** User object with the fields to be updated:

  - `firstName` (string): Updated first name of the user.
  - `lastName` (string): Updated last name of the user.
  - `username` (string): Updated username for the user.
  - `email` (string): Updated email for the user.
  - `password` (string): Updated password for the user.
  - `oldPassword` (string): Old password for the user.
  - `bio` (string): Updated bio information.
  - `avatar` (string): Updated avatar URL.
  - `allowAnonymous` (boolean): updated allow anonymous questions.

- **Response:**
  - `200 OK` status code with the updated user info object in the response body.

### Delete User

- **Endpoint:** `/users/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Response:**
  - `204 No Content` status code indicating a successful deletion of the user.

### Get Unanswered Questions in Inbox

- **Endpoint:** `/users/:id/inbox`
- **Method:** `GET`
- **Query Parameters:**
  - `cat` (string, optional): Category name to filter questions. If not provided, retrieve questions from all categories.
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Response:**
  - `200 OK` status code, Successfully retrieved the unanswered questions.
  - `questions` (array): List of unanswered questions in the specified category or in all categories if `cat` is not provided.

### Ask Questions at Inbox

- **Endpoint:** `/users/:id/inbox`
- **Method:** `POST`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Request Body:**
  - `cat` (string): Category name for the question.
  - `question` (string): The question text.
- **Response:**
  - `201 Created` status code, Question successfully asked.
  - `question` (object): The created question object.

### Get Answered Questions

- **Endpoint:** `/users/:id/answers`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Description:** Retrieve the answered questions for a user.
- **Response:**
  - `200 OK` status code: Successfully retrieved the answered questions.
    - Content: Array of answered question objects.
  - `401 Unauthorized` status code: User is not authenticated.
    - Content: Error message indicating the user is not authorized.
  - `404 Not Found` status code: User does not exist.
    - Content: Error message indicating the user does not exist.

### Get Users Following

- **Endpoint:** `/users/:id/following`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Description:** Retrieve the users that the specified user is following.
- **Response:**
  - `200 OK` status code: Successfully retrieved the list of users.
    - Content: Array of user objects.
  - `401 Unauthorized` status code: User is not authenticated.
    - Content: Error message indicating the user is not authorized.
  - `404 Not Found` status code: User does not exist.
    - Content: Error message indicating the user does not exist.

### Get User Followers

- **Endpoint:** `/users/:id/followers`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Description:** Retrieve the users that follow the specified user.
- **Response:**
  - `200 OK` status code: Successfully retrieved the list of users.
    - Content: Array of user objects.
  - `401 Unauthorized` status code: User is not authenticated.
    - Content: Error message indicating the user is not authorized.
  - `404 Not Found` status code: User does not exist.
    - Content: Error message indicating the user does not exist.

### Follow User

- **Endpoint:** `/users/:id/followers`
- **Method:** `POST`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Response:**
  - `201 Created` status code indicating a successful follow action.
  - `message` (string): Follow success message.

### Unfollow User

- **Endpoint:** `/users/:id/followers`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Response:**
  - `204 No Content` status code indicating a successful unfollow action.
  - `message` (string): Unfollow success message.

## Questions Endpoints

### Search Q&A

- **Endpoint:** `/questions`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Query Parameters:**
  - `query` (string): Search query for Q&A.
  - `user` (string, optional): User ID for filtering Q&A by specific user.
  - `followed` (boolean, optional): Indicates whether to include only followed users' Q&A.
  - `page` (number, optional): Page number for pagination.
  - `limit` (number, optional): Number of results per page.
- **Response:**
  - `200 OK` status code with a list of matched question objects in the response body.
    - `questions` (array): List of matched question objects.

### Create Question

- **Endpoint:** `/questions`
- **Method:** `POST`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token.
- **Request Body:**

  Question object with the required fields:

  - `toUser` (string): ID of the user receiving the question.
  - `question` (string): The question text.
  - `isAnonymous` (boolean): Indicates whether the question should be anonymous.
  - `category` (string): Category of the question.

- **Response:**

  `201 Created` status code with the following response body:

  - `question` (object): The created question object.

### Get Question

- **Endpoint:** `/questions/:id`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token ???
- **Response:**
  - `200 OK` status code with the question object in the response body.

### Update Question

- **Endpoint:** `/questions/:id`
- **Method:** `PATCH`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Request Body:**
  - Question object with the fields to be updated (`answer`, `category`).
- **Response:**
  - `200 OK` status code with the updated question object in the response body.

### Delete Question

- **Endpoint:** `/questions/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Response:**
  - `204 No Content` status code indicating a successful deletion of the question.

### Create Comment

- **Endpoint:** `/questions/:id/comments`
- **Method:** `POST`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Request Body:**
  - Comment object with the required field (`content`).
- **Response:**
  - `201 Created` status code with the created comment object in the response body.

### Like Question

- **Endpoint:** `/questions/:id/likes`
- **Method:** `POST`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Response:**
  - `201 Created` status code indicating a successful creation of the like.
  - `message` (string): Like success message.

### Unlike Question

- **Endpoint:** `/questions/:id/likes`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Response:**
  - `204 No Content` status code indicating a successful deletion of the like.
  - `message` (string): Unlike success message.

## Comments Endpoints

### Update Comment

- **Endpoint:** `/comments/:id`
- **Method:** `PATCH`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Request Body:**
  - Comment object with the fields to be updated (`content`).
- **Response:**
  - `200 OK` status code with the updated comment object in the response body.

### Delete Comment

- **Endpoint:** `/comments/:id`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Response:**
  - `204 No Content` status code indicating a successful deletion of the comment.

## Category Endpoints

### Add New Category

- **Endpoint:** `/category`
- **Method:** `POST`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Request Body:**
  - `name` (string): Name of the new category to add.
- **Response:**
  - `201 Created` status code, Category successfully added.
  - `message` (string): Success message confirming the category addition.

### Get All Questions of Category

- **Endpoint:** `/category/:name`
- **Method:** `GET`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Response:**
  - `200 OK` status code, Successfully retrieved questions in the specified category.
  - `questions` (array): List of all questions in the specified category.

### Rename Category

- **Endpoint:** `/category/:name`
- **Method:** `PUT`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Request Body:**
  - `name` (string): New name for the category.
- **Response:**
  - `200 OK` status code, Category name successfully updated.
  - `message` (string): Success message confirming the category rename.

### Remove Category

- **Endpoint:** `/category/:name`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization` or `Cookie` header with the JWT token
- **Response:**
  - `204 No Content` status code, Category successfully removed.
  - `message` (string): Success message confirming the category removal.
