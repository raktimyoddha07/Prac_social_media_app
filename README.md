# Social Media Application

A beginner friendly social media application to understand full stack CRUD operations and real-time chatting using web-sockets.

## Key features

1. User can create a profile
2. User can create post with selected image and caption
3. User will get all the posts in his feed
4. User can like/dislike or comment on any post
5. There is dedicated user profile where user can edit his username, profile picture and bio and view all his posts
6. User can visit other users profile to start a conversation
7. User can do real-time conversation with why one he wants

## Tech stack used:

- Frontend: React.js, Typescript, Redux, Chakra UI
- Backend: FastAPI, SqlAlchemy
- Database: PostgreSQL

## Database Relationship Diagram

![image](https://github.com/raktimyoddha07/Prac_social_media_app/raw/master/assets/database_relation.png)
## Sample of .env 

### For Frontend 

```
VITE_API_BASE_URL=
```

### For Backend

```
DATABASE_URL=
SECRET_KEY=
ALGORITHM=
ACCESS_TOKEN_EXPIRE_MINUTES=
FRONTEND_URL=
```

## How to run (for Windows)

### For Frontend

1. Open frontend directory

```
cd frontend
```

2. Install all dependencies

```
npm i
```

3. Run the frontend

```
npm run dev
```

### For Backend

1. Open backend directory

```
cd backend
```

2. Create virtual environment

```
python -m venv .venv
```

3. Activate virtual environment

```
.venv\Scripts\activate.bat
```

4. Install all dependencies

```
pip install -r requirements.txt
```

5. Run the server

```
uvicorn main:socket_app --reload
```

## API endpoints

```text
========================  
AUTH  
========================  
  
POST /auth/register  
POST /auth/login  
GET /auth/me  
  
  
========================  
USERS  
========================  
  
GET /users  
GET /users/{user_id}  
GET /users/{user_id}/posts  
PUT /users/{user_id}  
DELETE /users/{user_id}  
  
  
========================  
POSTS  
========================  
  
POST /posts  
GET /posts  
GET /posts/{post_id}  
PUT /posts/{post_id}  
DELETE /posts/{post_id}  
  
  
========================  
COMMENTS  
========================  
  
POST /posts/{post_id}/comments  
GET /posts/{post_id}/comments  
  
PUT /comments/{comment_id}  
DELETE /comments/{comment_id}  
  
  
========================  
LIKES  
========================  
  
POST /posts/{post_id}/like  
DELETE /posts/{post_id}/like  
GET /posts/{post_id}/likes  
  
  
========================  
DISLIKES  
========================  
  
POST /posts/{post_id}/dislike  
DELETE /posts/{post_id}/dislike  
GET /posts/{post_id}/dislikes  
  
  
========================  
CONVERSATIONS  
========================  
  
POST /conversations  
GET /conversations  
GET /conversations/{conversation_id}  
DELETE /conversations/{conversation_id}  
  
  
========================  
MESSAGES  
========================  
  
POST /conversations/{conversation_id}/messages  
GET /conversations/{conversation_id}/messages  
  
GET /messages/{message_id}  
DELETE /messages/{message_id}  
  
  
========================  
UPLOADS  
========================  
  
POST /upload/image
```