// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\controllers\userController.js

// --- IMPORTS ---

// `express-async-handler`: A utility middleware for Express that wraps async route handlers.
// It catches any errors thrown in async functions and passes them to the Express error
// handling middleware, so you don't need to write `try...catch` blocks in every controller.
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
// `jsonwebtoken` (JWT): A library to create and verify JSON Web Tokens. JWTs are used
// for securely transmitting information between parties as a JSON object, commonly for
// authentication and authorization.
const jwt = require("jsonwebtoken");
// `User`: The Mongoose model for the 'User' collection. It provides methods to interact
// with the users in the database (e.g., `findOne`, `create`).
const User = require("../models/User");

// --- HELPER FUNCTION ---

// A helper function to generate a JWT for a given user ID.
const generateToken = (id) => {
  // `jwt.sign()` creates and signs a new token.
  // - First argument (payload): The data to include in the token. Here, we're just
  //   including the user's unique ID. This ID can be extracted later on the server
  //   to identify the authenticated user.
  // - Second argument (secret): The secret key used to sign the token. This is fetched
  //   from environment variables for security. The signature ensures that the token
  //   hasn't been tampered with.
  // - Third argument (options):
  //   - `expiresIn: "30d"`: Sets an expiration date for the token (30 days). After this
  //     period, the token will be invalid and the user will need to log in again.
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// --- CONTROLLER FUNCTIONS ---

// @desc    Authenticate a user & get token
// @route   POST /api/users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // Destructure email and password from the request body.
  const { email, password } = req.body;

  // Find a user in the database with the provided email.
  // `User.findOne()` is a Mongoose query that returns the first document matching the query object.
  const user = await User.findOne({ email });

  // Check if a user was found AND if the entered password matches the stored hashed password.
  // `user.matchPassword(password)` is a custom instance method we defined on our User model
  // in `models/User.js`. It uses `bcrypt.compare()` to securely check the password.
  if (user && (await user.matchPassword(password))) {
    // If authentication is successful, send a JSON response with user data and a new token.
    // It's good practice to not send the hashed password back to the client.
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    // If authentication fails (user not found or password incorrect), set the status
    // to 401 (Unauthorized) and throw an error. `asyncHandler` will catch this error
    // and pass it to Express's error handling middleware.
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  // Destructure name, email, and password from the request body.
  const { name, email, password } = req.body;

  // Basic validation: check if all required fields are present.
  if (!name || !email || !password) {
    // If any field is missing, set the status to 400 (Bad Request) and throw an error.
    res.status(400);
    throw new Error("Please enter all fields");
  }

  // Check if a user with the given email already exists in the database.
  const userExists = await User.findOne({ email });

  if (userExists) {
    // If the user already exists, send a 400 status and throw an error.
    res.status(400);
    throw new Error("User already exists");
  }

  // `User.create()` creates a new user document and saves it to the database.
  // The `pre('save')` middleware in the User model will automatically hash the password
  // before it is stored.
  const user = await User.create({
    name,
    email,
    password,
  });

  // If the user was created successfully...
  if (user) {
    // Send a 201 (Created) status and a JSON response with the new user's data
    // and a JWT for immediate login.
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    // This `else` block is a fallback. If `User.create()` fails for some unexpected
    // reason (e.g., a validation error not caught above), send a 400 status and throw an error.
    res.status(400);
    throw new Error("Invalid user Data");
  }
});

// --- EXPORT ---
// Exports the controller functions so they can be imported and used in `server.js` to define the API routes.
module.exports = { registerUser, loginUser };
