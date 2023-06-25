# Askify Design RFC

## Key Features

### Guest

- [ ] Can signup a new user
- [ ] Can login

### Common (Guest & User)

- [ ] Can read any question (including comments)
- [ ] Can read any profile

### User

- [ ] Can logout
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
- [ ] Can create his own inbox
- [ ] Can read his own inbox
- [ ] Can update his own inbox
- [ ] Can delete his own inbox
- [ ] Can like/unlike a question
- [ ] Can get Q&A from users they follow on the feed page
- [ ] Can search for users
- [ ] Can search for Q&A
  - [ ] weighted search
  - [ ] pagination
  - [ ] single user profile
  - [ ] only users I follow

## Database Design

**Note:** This is an inital design and may change at the development phase or may require further refinement.

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
