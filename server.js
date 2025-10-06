// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\server.js

// --- SETUP & IMPORTS ---
// This section imports all the necessary modules (libraries) and functions for the server.

// `dotenv`: This module loads environment variables from a local `.env` file into `process.env`.
// This is crucial for security and configuration, as it keeps sensitive data like database
// connection strings and JSON Web Token (JWT) secrets out of the source code. It should be required
// at the very top of the entry file so that `process.env` is populated before any
// other modules need to access it.
require("dotenv").config();

const express = require("express");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
// `cors`: A middleware to handle Cross-Origin Resource Sharing. This is essential for
// allowing your React frontend (running on a different port, e.g., 5173) to make
// requests to this backend server (running on port 5000).
const cors = require('cors');
// `protect`: A custom middleware function to secure routes. It checks for a valid
// JSON Web Token (JWT) in the request headers to ensure the user is authenticated before
// allowing the request to proceed to the route handler.
const { protect } = require("./middleware/authMiddleware");
const { errorHandler } = require("./middleware/errorMiddleware");


// --- DATABASE CONNECTION ---
const connectDB = require("./config/db");
connectDB();

// --- EXPRESS APP SETUP ---

// Creates an instance of the Express application. `app` is the main object that
// represents our web server.
const app = express();
app.use(helmet());
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
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Contact List API!");
});
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/contacts", require("./routes/contactRoutes"));

// --- ERROR HANDLING MIDDLEWARE ---
app.use(errorHandler);

// --- START SERVER ---

// This starts the server. The `app.listen()` method binds the Express application to the
// specified `PORT` and begins listening for incoming connections. The callback function
// is executed once the server is successfully running, logging a confirmation message.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
