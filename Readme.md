# Collaborative Code Editor with Real-Time Code Updates

This is a collaborative code editor project that allows multiple users to edit code together in real-time. It consists of a frontend built with React, a backend developed using Node.js, and MongoDB as the database. Real-time collaboration is achieved using WebSocket technology through the Socket.io library. Below, you'll find more details about the project structure and the technologies used.

## Technologies Used

### Frontend

- **React** (v18.2.0): The frontend of the application is built using React, a popular JavaScript library for building user interfaces.

- **React Router Dom** (v6.15.0): Used for handling client-side routing in the application.

- **Socket.io Client** (v4.7.2): This library enables real-time communication between the frontend and backend for collaborative code editing.

- **Testing Library**:
    - `@testing-library/jest-dom` (v5.17.0)
    - `@testing-library/react` (v13.4.0)
    - `@testing-library/user-event` (v13.5.0): These libraries are used for testing React components and user interactions.

- **Web Vitals** (v2.1.4): Helps monitor and improve the performance of the application.

### Backend

- **Node.js**: The backend is implemented in Node.js, a server-side JavaScript runtime.

- **Express** (v4.18.2): A web application framework for Node.js used for routing and handling HTTP requests.

- **Socket.io** (v4.7.2): Facilitates real-time communication between the frontend and backend, allowing multiple users to collaborate on code simultaneously.

- **MongoDB**: A NoSQL database used for storing application data.

- **Mongoose** (v7.5.0): An ODM (Object-Document Mapping) library for MongoDB, used for defining the data schema and interacting with the database.

- **Redis** (v4.6.8): An in-memory data store used for caching and improving application performance.

- **JWT (JSON Web Tokens)** (v9.0.2): Used for user authentication and authorization.

- **bcryptjs** (v2.4.3): A library for hashing passwords before storing them in the database.

- **express-validator** (v7.0.1): Middleware for request validation.

- **body-parser** (v1.20.2) and **cors** (v2.8.5): Middleware used for parsing incoming request bodies and handling CORS (Cross-Origin Resource Sharing) respectively.

### Development Dependencies

- **Mocha** (v10.2.0) and **Chai** (v4.3.8): Testing frameworks used for writing and executing backend tests.

- **Supertest** (v6.3.3): A library for testing HTTP requests and responses in the backend.

- **Socket.io Client** (v4.7.2): Used for testing WebSocket functionality in the frontend.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine.

2. Install the required dependencies for both the frontend and backend by running `npm install` in their respective directories.

3. Configure the database connection and other environment variables as needed.

4. Start the frontend and backend servers using `npm start` or the appropriate command.

5. Access the application in your web browser.

## Features

- Real-time code collaboration: Multiple users can edit code simultaneously and see each other's changes in real-time.

- User authentication: Users can sign up, log in, and have personalized experiences.

- Code version history: The application keeps track of code changes, allowing users to revert to previous versions.

- Syntax highlighting: Code editor includes syntax highlighting for popular programming languages.

- User presence: Shows which users are currently active in the code editor.

## Contributors

- Abhishek Sharma

## Acknowledgments

We would like to thank the open-source community for providing the tools and libraries that made this project possible.

If you have any questions or feedback, please don't hesitate to reach out to us!

# Backend Routes and Controllers

In this section of the README, we'll explore the backend routes and controllers used in the collaborative code editor project. Each route is explained along with its purpose and the expected request and response structures.

## Routes

### Room.js

#### `POST /create`

**Request:**

- **Name:** Create Room
- **Purpose:** Allows a user to create a new code collaboration room.
- **Request Structure:**
  ```json
  {
    "name": "Example Room",
    "description": "A room for collaborative coding"
  }
  ```

**Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "Please enter a name with only text and at least 5 characters",
      "Please enter a description with only text and at least 10 characters"
    ]
  }
  ```

**Token:** Required for authentication.

#### `GET /get/:id`

**Request:**

- **Name:** Get Room Details
- **Purpose:** Retrieves details of a code collaboration room by its ID.
- **Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "name": "Example Room",
      "description": "A room for collaborative coding",
      "owner": {
        "name": "John Doe",
        "email": "john@example.com"
      },
      "users": [
        {
          "name": "Alice Smith",
          "email": "alice@example.com"
        },
        {
          "name": "Bob Johnson",
          "email": "bob@example.com"
        }
      ]
    }
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "Room not found"
  }
  ```

**Token:** Required for authentication.

#### `PUT /update/:id`

**Request:**

- **Name:** Update Room
- **Purpose:** Allows a user to update the details of a code collaboration room.
- **Request Structure:**
  ```json
  {
    "name": "Updated Room Name",
    "description": "Updated description",
    "code": "console.log('Hello, World!');"
  }
  ```

**Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "Please enter a name with only text and at least 5 characters",
      "Please enter a description with only text and at least 10 characters"
    ]
  }
  ```

**Token:** Required for authentication.

#### `PUT /add-user/:id`

**Request:**

- **Name:** Add User to Room
- **Purpose:** Allows a user to add another user to a code collaboration room.
- **Request Structure:**
  ```json
  {
    "email": "newuser@example.com"
  }
  ```

**Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "Please enter a valid email"
    ]
  }
  ```

**Token:** Required for authentication.

#### `DELETE /delete/:id`

**Request:**

- **Name:** Delete Room
- **Purpose:** Allows a user to delete a code collaboration room.
- **Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "Room not found"
  }
  ```

**Token:** Required for authentication.

### User.js

#### `POST /signup`

**Request:**

- **Name:** Signup
- **Purpose:** Allows a new user to create an account.
- **Request Structure:**
  ```json
  {
    "email": "user@example.com",
    "name": "John Doe",
    "password": "password123"
  }
  ```

**Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "Validation failed",
    "errors": [
      "User already exists"
    ]
  }
  ```

**Token:** Not required for signup.

#### `POST /login`

**Request:**

- **Name:** Login
- **Purpose:** Allows a user to log in and obtain an authentication token.
- **Request Structure:**
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

**Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true,
    "token": "your-jwt-token"
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "User not found"
  }
  ```

**Token:** Not required for login.

#### `GET /get`

**Request:**

- **Name:** Get User Details
- **Purpose:** Retrieves details of the authenticated user.
- **Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true,
    "data": {
      "name": "John Doe",
      "email": "user@example.com",
      "room": [
        {
          "id": "room-id",
          "role": "owner"
        },
        {
          "id": "another-room-id",
          "role": "user"
        }
      ]
    }
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "User not found"
  }
  ```

**Token:** Required for authentication.

#### `DELETE /delete`

**Request:**

- **Name:** Delete User Account
- **Purpose:** Allows the authenticated user to delete their account.
- **Response (Success):**

- **Response Structure:**
  ```json
  {
    "success": true
  }
  ```

**Response (Error):**

- **Response Structure:**
  ```json
  {
    "message": "User not found"
  }
  ```

**Token:** Required for authentication.

These routes and controllers form the backbone of the collaborative code editor application's backend, allowing users to create and manage rooms for real-time code collaboration and manage their user accounts. The response structures provide clear guidance on the expected data format in both successful and error scenarios. Authentication tokens are required for most operations to ensure security and user access control.

# Configuration Setup

To run the collaborative code editor project successfully, you'll need to set up a `config.js` file with the following configuration parameters. This file will help configure various aspects of the application, such as database connection, user authentication, room validation, and more. Additionally, there's a note on changing frontend fetch request URLs to match your backend server URL.

Here's how you can create and set up the `config.js` file:

1. Create a file named `config.js` in the root directory of your backend project.

2. Open the `config.js` file and add the following configuration parameters:

```javascript
module.exports = {
  db: {
    url: 'mongodb://localhost:27017/your-database-name' // Replace with your MongoDB database URL
  },
  user: {
    name: {
      length: 5
    },
    password: {
      saltRounds: 10,
      length: 8
    }
  },
  room: {
    name: {
      length: 5
    },
    description: {
      length: 5
    }
  },
  jwt: {
    secret: 'your-secret-key' // Replace with a strong and unique secret key for JWT
  },
  port: 4000, // Port on which your backend server will run
  cors: {
    origin: 'http://localhost:3000' // Replace with the origin URL of your frontend application
  }
}
```

Make sure to replace the placeholders with your actual configuration values.

**Note:** To ensure that your frontend fetch requests communicate with the backend correctly, update the URLs in your frontend code where you make API requests to match the URL where your backend server is hosted. For example, if your backend server is running on a different host or port, update the `origin` value in the `cors` configuration to allow requests from the correct frontend URL. Additionally, replace `'http://localhost:3000'` with the URL of your frontend application in the frontend code where you make fetch requests to the backend.

With the `config.js` file properly configured, your collaborative code editor project will have the necessary settings for database connection, user authentication, and more.