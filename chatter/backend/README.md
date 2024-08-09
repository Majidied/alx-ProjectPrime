# Chatter Backend

This is the backend part of the **Chatter** project. It provides RESTful API endpoints for user authentication and other functionalities. The backend is built with **TypeScript**, **Express**, **MongoDB**, **JWT (JSON Web Tokens)** for authentication, and **Socket.io** for real-time communication.

## Table of Contents

- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [API Routes](#api-routes)
  - [User Authentication](#user-authentication)
  - [User Profile](#user-profile)
  - [Messaging](#messaging)
- [Environment Variables](#environment-variables)
- [License](#license)

## Project Structure

The backend part of the project follows a structured layout:

```
backend/
│
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── sockets/
│   └── server.ts
│
├── .env
├── .eslintrc.json
├── package.json
├── tsconfig.json
└── README.md
```

- **src/**: Contains all the TypeScript source files.
- **config/**: Configuration-related files (e.g., database configuration).
- **controllers/**: Business logic for handling requests and responses.
- **middleware/**: Middleware functions like authentication.
- **models/**: Mongoose models for MongoDB.
- **routes/**: API route handlers.
- **services/**: Service classes or utility functions.
- **sockets/**: Socket.io-related logic.
- **server.ts**: The entry point of the backend application.

## Getting Started

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/majidied/alx-ProjectPrime.git
   cd alx-ProjectPrime/chatter/backend
   ```

2. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Configure Environment Variables:**

   Create a `.env` file in the root of the `backend/` directory and add the following:

   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/chatter
   JWT_SECRET=your_jwt_secret_key
   ```

   Replace `your_jwt_secret_key` with a strong secret key for JWT.

4. **Run the Application:**

   Use one of the available scripts (see below) to start the server.

## Available Scripts

In the project directory, you can run the following scripts:

- **`npm run start:dev`**: 
  - This command uses `nodemon` to start the server in development mode. Nodemon watches for file changes and automatically restarts the server.
  
  ```bash
  npm run start:dev
  ```

- **`npm run build`**: 
  - This command compiles the TypeScript code from the `src/` directory into JavaScript in the `build/` directory. It uses `rimraf` to clean the previous build before compiling.

  ```bash
  npm run build
  ```

- **`npm start`**: 
  - This command first compiles the TypeScript code and then starts the server using the compiled JavaScript files from the `build/` directory.

  ```bash
  npm start
  ```

- **`npm run lint`**: 
  - This command runs ESLint to analyze the code for potential issues and enforce coding standards. It checks all files within the `src/` directory.

  ```bash
  npm run lint
  ```

## API Routes

### User Authentication

The following routes are available for user authentication:

- **`POST /api/auth/register`**: Registers a new user.
  - **Request Body**:
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string"
    }
    ```
  - **Response**:
    - Success: `201 Created` with a message `User registered successfully`.
    - Failure: `500 Internal Server Error` with an error message.

- **`POST /api/auth/login`**: Logs in an existing user.
  - **Request Body**:
    ```json
    {
      "email": "string",
      "password": "string"
    }
    ```
  - **Response**:
    - Success: `200 OK` with a JWT token.
    - Failure: `400 Bad Request` with a message `Invalid credentials`.

### User Profile

These routes handle user profile management:

- **`GET /api/users/me`**: Retrieves the profile of the logged-in user.
  - **Headers**: `Authorization: Bearer <JWT>`
  - **Response**:
    - Success: `200 OK` with user profile data.
    - Failure: `401 Unauthorized` if no valid token is provided.

- **`PUT /api/users/me`**: Updates the profile of the logged-in user.
  - **Headers**: `Authorization: Bearer <JWT>`
  - **Request Body**:
    ```json
    {
      "username": "string",
      "email": "string"
    }
    ```
  - **Response**:
    - Success: `200 OK` with the updated user profile data.
    - Failure: `400 Bad Request` or `401 Unauthorized`.

### Messaging

These routes handle sending and receiving messages between users:

- **`POST /api/messages`**: Sends a new message.
  - **Headers**: `Authorization: Bearer <JWT>`
  - **Request Body**:
    ```json
    {
      "to": "userId",
      "message": "string"
    }
    ```
  - **Response**:
    - Success: `201 Created` with message details.
    - Failure: `400 Bad Request` or `401 Unauthorized`.

- **`GET /api/messages/:conversationId`**: Retrieves messages for a specific conversation.
  - **Headers**: `Authorization: Bearer <JWT>`
  - **Response**:
    - Success: `200 OK` with a list of messages.
    - Failure: `400 Bad Request` or `401 Unauthorized`.

- **`GET /api/conversations`**: Retrieves all conversations for the logged-in user.
  - **Headers**: `Authorization: Bearer <JWT>`
  - **Response**:
    - Success: `200 OK` with a list of conversations.
    - Failure: `400 Bad Request` or `401 Unauthorized`.

These routes allow users to manage their profiles and communicate through messaging within the Chatter application. The JWT tokens are required to access these protected routes.

## Environment Variables

The backend relies on the following environment variables:

- **`PORT`**: The port on which the server will run (default: `5000`).
- **`MONGO_URI`**: The URI for connecting to the MongoDB database.
- **`JWT_SECRET`**: A secret key used for signing and verifying JWT tokens.

## License

This project is licensed under the MIT License. See the [LICENSE](../LICENSE) file for details.
