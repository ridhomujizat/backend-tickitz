# BACKEND TICKITZ
This is 

## Requirements
- NodeJS v12 LTS
- Mysql

## How To Run This App

- Make sure you had clone this repo
- Copy environment from `.env.example` to `.env`
- Configure your `.env` file according to your Postgres credentials
- Open your terminal in this project and run 
  ```
  npm i
  ```
- And then
  ```
  npx nodemon
  ```

## API SPECS

### Auth
- POST `/login` Route for login to existing user
- POST `/register` Route for register new user
- POST `/forgot_password` Route for request reset pasword **(Not done yet)**
- POST `/forgot_password/:code` Route for change password **(Not done yet)**

### Admin
- POST `/genre` Route for add new genre
- PATCH/DELETE `/genre/:id` Route for edit genre name
- POST `/moovies` Route for add new genre
- PATCH/DELETE `/movies` Route for change data movie

### All Role
- GET `/genre` Route for get item in genre
- GET `/movies/genre` Route for get movie by genre selected
- GET `/movies` Route for get list movie
