# Askify Design RFC

## Key Features

### Guest

- [x] Can signup a new user
- [x] Can login

### Common (Guest & User)

- [ ] Can read any question (including comments)
- [ ] Can read any profile

### User

- [x] Can logout
- [ ] Can ask questions (select proper inbox)
- [ ] Can delete his own questions
- [ ] Can answer his own questions
- [ ] Can update his own answer
- [ ] Can delete his own answer
- [ ] Can comment on any question
- [ ] Can delete his own comments
- [ ] Can update his own profile data
- [ ] Can follow/unfollow other users
- [ ] Can block/unblock other users
- [ ] Can read his own inbox
- [x] Can create his own inbox categories
- [x] Can rename his own inbox categories
- [x] Can delete his own inbox categories
- [ ] Can like/unlike a question
- [ ] Can get Q&A from users they follow on the feed page
- [ ] Can search for users
- [ ] Can search for Q&A
  - [ ] weighted search
  - [ ] pagination
  - [ ] single user profile
  - [ ] only users I follow

## Database Design Overview

> :warning: This is a preliminary incomplete design, and it's likely to change and evolve during the development phase.

### Users

| Field          | Type     |
| -------------- | -------- |
| ID             | ObjectId |
| firstName      | String   |
| lastName       | String   |
| username       | String   |
| email          | String   |
| password       | String   |
| avatar         | String   |
| bio            | String   |
| allowAnonymous | Boolean  |
| categories     | [String] |
| followers      | Number   |
| following      | Number   |

### Questions

| Field       | Type     |
| ----------- | -------- |
| ID          | ObjectId |
| fromUser    | ObjectId |
| toUser      | ObjectId |
| question    | String   |
| answer      | String   |
| isAnonymous | Boolean  |
| category    | String   |
| createdAt   | Date     |
| answeredAt  | Date     |
| likes       | Number   |
| comments    | Number   |

### Comments

| Field      | Type     |
| ---------- | -------- |
| ID         | ObjectId |
| questionID | ObjectId |
| userID     | ObjectId |
| content    | String   |
| createdAt  | Date     |

### Likes

| Field      | Type     |
| ---------- | -------- |
| ID         | ObjectId |
| questionID | ObjectId |
| userID     | ObjectId |

### Followers

| Field      | Type     |
| ---------- | -------- |
| ID         | ObjectId |
| userID     | ObjectId |
| followerID | ObjectId |

## API Design Overview

> :warning: This is a preliminary incomplete design, and it's likely to change and evolve during the development phase.

### Auth

- Mount point: / (root)

| Method | Endpoint | Function         |
| ------ | -------- | ---------------- |
| POST   | /signup  | Create new user  |
| POST   | /login   | Log the user in  |
| POST   | /logout  | Log the user out |

### Users

- Mount point: /users/

| Method | Endpoint            | Function                                  |
| ------ | ------------------- | ----------------------------------------- |
| GET    | /                   | Search users                              |
| GET    | /profiles/:username | get profile info                          |
| GET    | /:id                | get user info                             |
| PATCH  | /:id                | update user info                          |
| DELETE | /:id                | delete user                               |
| GET    | /:id/inbox          | get unanswered questions in inbox         |
| POST   | /:id/inbox          | ask this user a question in inbox         |
| GET    | /:id/answers        | get answered questions                    |
| GET    | /:id/following      | get the users that this user is following |
| GET    | /:id/followers      | get the users that follows this user      |
| POST   | /:id/followers      | follow this user                          |
| DELETE | /:id/followers      | unfollow this user                        |

### Questions

- Mount point: /questions/

| Method | Endpoint      | Function                             |
| ------ | ------------- | ------------------------------------ |
| GET    | /             | Search questions                     |
| POST   | /             | Ask a question to user               |
| GET    | /:id          | read a question                      |
| PATCH  | /:id          | edit the answer                      |
| DELETE | /:id          | delete the question                  |
| GET    | /:id/comments | get comments on this question        |
| POST   | /:id/comments | add a comment to this question       |
| `GET`  | /:id/likes    | get all users who liked the question |
| POST   | /:id/likes    | like the question                    |
| DELETE | /:id/likes    | unlike the question                  |

### Comments

- Mount point: /comments/

| Method | Endpoint | Function                 |
| ------ | -------- | ------------------------ |
| PATCH  | /:id     | edit the comment?        |
| DELETE | /:id     | delete the comment, who? |

### Category

- Mount point: /category/

| Method | Endpoint   | Function            |
| ------ | ---------- | ------------------- |
| POST   | /          | create new category |
| GET    | /          | get all categories  |
| PUT    | /:category | rename the category |
| DELETE | /:category | delete the category |
