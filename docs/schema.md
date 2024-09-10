# Askify Database Schema Documentation

## Tables Overview

> **Note:** The implementation should avoid `NULL` values where possible to ensure data integrity and consistency.

### Users Table

| Column          | Data Type | Constraints               | Description                                               |
| --------------- | --------- | ------------------------- | --------------------------------------------------------- |
| id              | UUID      | Primary Key               | Unique identifier for each user                           |
| username        | TEXT      | UNIQUE                    | Unique username chosen by the user                        |
| email           | TEXT      | UNIQUE                    | User's email address for authentication and communication |
| password        | TEXT      |                           | The hashed password of the user                           |
| name            | TEXT      |                           | Display name of the user, visible to others               |
| bio             | TEXT      | DEFAULT ""                | User's bio or personal description, visible to others     |
| allow_anonymous | BOOLEAN   | DEFAULT TRUE              | Flag indicating if the user accepts anonymous questions   |
| email_verified  | BOOLEAN   | DEFAULT FALSE             | Indicates if the user's email is verified                 |
| updated_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp of the last modification to the user's data     |
| created_at      | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the user account was created               |

### Categories Table

| Column      | Data Type | Constraints               | Description                             |
| ----------- | --------- | ------------------------- | --------------------------------------- |
| id          | UUID      | Primary Key               | Unique identifier for each category     |
| user_id     | UUID      | Foreign Key (Users.id)    | ID of the user who owns the category    |
| name        | TEXT      |                           | The name of the category                |
| description | TEXT      | DEFAULT ""                | The description of the category         |
| created_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Timestamp when the category was created |

### Questions Table

| Column       | Data Type | Constraints                              | Description                                  |
| ------------ | --------- | ---------------------------------------- | -------------------------------------------- |
| id           | UUID      | Primary Key                              | Unique identifier for each question          |
| from_user_id | UUID      | Foreign Key (Users.id)                   | ID of the user who asked the question        |
| to_user_id   | UUID      | Foreign Key (Users.id) ON DELETE CASCADE | ID of the user who received the question     |
| category_id  | UUID      | Foreign Key (Categories.id)              | The category ID associated with the question |
| content      | TEXT      |                                          | The text content of the question             |
| is_anonymous | BOOLEAN   |                                          | Whether the question is asked anonymously    |
| is_answered  | BOOLEAN   | DEFAULT FALSE                            | Whether the question is answered or not      |
| updated_at   | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP                | The timestamp of the last update             |
| created_at   | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP                | The timestamp when the question was created  |

### Answers Table

| Column      | Data Type | Constraints                | Description                                |
| ----------- | --------- | -------------------------- | ------------------------------------------ |
| id          | UUID      | Primary Key                | Unique identifier for each answer          |
| question_id | UUID      | Foreign Key (Questions.id) | ID of the question being answered          |
| user_id     | UUID      | Foreign Key (Users.id)     | ID of the user who answered the question   |
| content     | TEXT      |                            | The text content of the answer             |
| updated_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | Timestamp when the answer was last updated |
| created_at  | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP  | Timestamp when the answer was created      |
