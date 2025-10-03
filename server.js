// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\server.js

// Line 1: Loads environment variables from a .env file into process.env.
// This is crucial for security, as it keeps sensitive information like your
// database connection string out of the source code.
require("dotenv").config(); 

// Line 2-4: Import necessary Node.js modules (libraries).
const express = require("express"); // The main framework for building the server and handling HTTP requests.
const mongoose = require("mongoose"); // An ODM (Object Data Modeling) library for MongoDB. It simplifies interactions with the database.
const cors = require("cors"); // A middleware to handle Cross-Origin Resource Sharing. This is essential for allowing your React frontend (running on a different port) to make requests to this backend server.

// Line 7-12: Imports the specific functions from your controller file.
// This is a great practice for separating concerns. The server.js file handles routing,
// while the contactController.js file handles the logic for each route.
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact
} = require("./controllers/contactController");

// Line 15: Defines an asynchronous function to connect to the MongoDB database.
const connectDB = async () => {
  try {
    // Line 18: This is the core connection logic. It uses mongoose.connect() to establish
    // a connection to the MongoDB database. The connection string (URI) is securely
    // pulled from your environment variables, which were loaded by dotenv.
    // The `await` keyword pauses the function until the connection is successful or fails.
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    // Line 19: If the connection is successful, this line logs a confirmation message
    // to the console, including the host of the connected database.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Line 21: If mongoose.connect() fails, it throws an error which is caught here.
    console.error(`Error: ${error.message}`);
    
    // Line 23: This is a critical step. If the database connection fails, the application
    // cannot function. process.exit(1) immediately stops the Node.js process with a
    // "failure" code (1).
    process.exit(1);
  }
};

// Line 28: Calls the function to connect to the database as soon as the server starts.
connectDB();

// Line 30: Creates an instance of the Express application.
const app = express();
// Line 31: Defines the port number the server will listen on.
const PORT = 5000;

// Line 33: This is a crucial piece of middleware. It tells Express to automatically
// parse the body of incoming POST, PUT, and PATCH requests that have a
// 'Content-Type' of 'application/json'. The parsed JSON data is then made available
// on `req.body`.
app.use(express.json());

// Line 34: This middleware enables CORS for all routes. It adds the necessary
// HTTP headers to responses (like `Access-Control-Allow-Origin: *`) so that
// browsers don't block requests from your React app (on localhost:5173) to this
// server (on localhost:5000).
app.use(cors());

// Line 37-39: Defines a simple "health check" route. When you navigate to
// http://localhost:5000/ in your browser, you'll see this message, confirming
// the API server is running.
app.get("/", (req, res) => {
  res.send("Welcome to the MERN Contact List API!");
});

// --- API Routes for CRUD Operations ---
// These lines map specific HTTP methods and URL paths to the controller functions.

// Line 43: GET /api/contacts -> getContacts
// When a GET request is made to this URL, the getContacts function will execute.
app.get("/api/contacts", getContacts);

// Line 44: POST /api/contacts -> createContact
// When a POST request is made to this URL, the createContact function will execute.
app.post("/api/contacts", createContact);

// Line 45: PUT /api/contacts/:id -> updateContact
// When a PUT request is made to a URL like /api/contacts/123, the updateContact
// function will execute. The `:id` is a URL parameter.
app.put("/api/contacts/:id", updateContact);

// Line 46: DELETE /api/contacts/:id -> deleteContact
// When a DELETE request is made to a URL like /api/contacts/123, the deleteContact
// function will execute.
app.delete("/api/contacts/:id", deleteContact);

// Line 49-51: This starts the server. The app.listen() method binds the server
// to the specified PORT and waits for incoming connections. The callback function
// logs a message to the console once the server is successfully running.
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
