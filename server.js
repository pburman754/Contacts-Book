// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\server.js

// --- SETUP & IMPORTS ---
// This section imports all the necessary modules (libraries) and functions for the server.

// `dotenv`: This module loads environment variables from a local `.env` file into `process.env`.
// This is crucial for security and configuration, as it keeps sensitive data like database
// connection strings and JSON Web Token (JWT) secrets out of the source code. It should be required
// at the very top of the entry file so that `process.env` is populated before any
// other modules need to access it.
require("dotenv").config();

// `express`: The core web framework for Node.js. It provides a robust set of features
// for building web and mobile applications, including routing, middleware, and more.
const express = require("express");
// `mongoose`: An Object Data Modeling (ODM) library for MongoDB. It simplifies interactions
// with the database by providing a schema-based solution to model application data.
const mongoose = require("mongoose");
// `cors`: A middleware to handle Cross-Origin Resource Sharing. This is essential for
// allowing your React frontend (running on a different port, e.g., 5173) to make
// requests to this backend server (running on port 5000).
const cors = require('cors');
// `protect`: A custom middleware function to secure routes. It checks for a valid
// JSON Web Token (JWT) in the request headers to ensure the user is authenticated before
// allowing the request to proceed to the route handler.
const { protect } = require("./middleware/authMiddleware");

// Imports the specific route handler (controller) functions from their respective files.
// This is a great practice for "separation of concerns." The `server.js` file handles
// routing and server setup, while the controller files contain the business logic for each API endpoint.
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("./controllers/contactController");
const { registerUser, loginUser } = require("./controllers/userController");

// --- DATABASE CONNECTION ---

// Defines an `async` function to connect to the MongoDB database using Mongoose.
const connectDB = async () => {
  try {
    // This is the core connection logic. `mongoose.connect()` establishes a connection
    // to the MongoDB database.
    // - `process.env.MONGO_URI`: The connection string (URI) is securely pulled from
    //   your environment variables.
    // - `await`: Pauses the function until the connection is successful or fails.
    const conn = await mongoose.connect(process.env.MONGO_URI, {});

    // If the connection is successful, this line logs a confirmation message to the
    // console, including the host of the connected database for verification.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // If `mongoose.connect()` fails, it throws an error which is caught here.
    console.error(`Database Connection Error: ${error.message}`);

    // This is a critical step. If the database connection fails, the application
    // cannot function. `process.exit(1)` immediately stops the Node.js process
    // with a "failure" code (1).
    process.exit(1);
  }
};
// Calls the function to initiate the database connection as soon as the server starts.
connectDB();

// --- EXPRESS APP SETUP ---

// Creates an instance of the Express application. `app` is the main object that
// represents our web server.
const app = express();
// Defines the port number the server will listen on. It's good practice to use an
// environment variable for this (e.g., `process.env.PORT`), but a hardcoded value is fine for development.
const PORT = 5000;

// --- MIDDLEWARE ---
// Middleware are functions that execute during the lifecycle of a request to the server,
// before the final route handler is reached. They have access to the request (`req`),
// response (`res`), and the `next` middleware function in the application’s request-response cycle.

// `app.use()` mounts middleware functions at a specified path (or globally if no path is specified).

// `express.json()`: A built-in Express middleware. It parses incoming
// requests with JSON payloads (i.e., with a 'Content-Type' header of 'application/json').
// The parsed JSON data is then made available on the `req.body` property for route handlers to use.
app.use(express.json());

// `cors()`: This middleware enables Cross-Origin Resource Sharing for all routes.
// It adds the necessary HTTP headers to responses (like `Access-Control-Allow-Origin: *`)
// so that browsers don't block requests from the frontend to this backend server.
app.use(cors());

// --- ROUTES ---
// This section defines the API endpoints (routes) and maps them to their corresponding controller functions.

// Defines a simple "health check" route at the root URL (`/`). When you navigate to
// `http://localhost:5000/` in your browser, this handler sends a welcome message, confirming
// that the API server is running.
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Contact List API!");
});

// --- User Routes ---
// `app.post(path, handler)`: Maps an HTTP POST request at the specified `path` to a `handler` function.
// This route handles new user registration by calling the `registerUser` controller.
app.post("/api/users", registerUser);
// This route handles user login by calling the `loginUser` controller.
app.post("/api/users/login", loginUser);

// --- Contact Routes (Protected) ---
// These routes are for CRUD (Create, Read, Update, Delete) operations on contacts.
// They all use the `protect` middleware, which means a user must be logged in
// (and provide a valid token) to access them.

// GET /api/contacts: Fetches all contacts belonging to the logged-in user.
// The `protect` middleware runs first. If authentication is successful, it calls `next()`,
// and execution proceeds to the `getContacts` handler. If not, it sends an error response.
app.get("/api/contacts", protect, getContacts);

// POST /api/contacts: Creates a new contact associated with the logged-in user.
app.post("/api/contacts", protect, createContact);

// PUT /api/contacts/:id: Updates an existing contact.
// The `:id` is a URL parameter that specifies which contact to update. It's available via `req.params.id`.
app.put("/api/contacts/:id", protect, updateContact);

// DELETE /api/contacts/:id: Deletes an existing contact.
app.delete("/api/contacts/:id", protect, deleteContact);

// --- START SERVER ---

// This starts the server. The `app.listen()` method binds the Express application to the
// specified `PORT` and begins listening for incoming connections. The callback function
// is executed once the server is successfully running, logging a confirmation message.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
