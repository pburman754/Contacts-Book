// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\middleware\authMiddleware.js

// --- IMPORTS ---

// `jsonwebtoken` (JWT): Used to verify the token sent by the client.
const jwt = require("jsonwebtoken");
// `express-async-handler`: A utility to handle errors in async middleware without `try...catch`.
const asyncHandler = require("express-async-handler");
// `User`: The Mongoose model, used to find the user associated with the token.
const User = require("../models/User");

// --- MIDDLEWARE DEFINITION ---

// `protect` is a middleware function designed to protect routes that require authentication.
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the `Authorization` header exists and starts with "Bearer".
  // This is the standard convention for sending JWTs.
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // 1. EXTRACT THE TOKEN
      // The token is sent in the format "Bearer <token>". We split the string by the
      // space and take the second part, which is the token itself.
      token = req.headers.authorization.split(" ")[1];

      // 2. VERIFY THE TOKEN
      // `jwt.verify()` decodes and verifies the token's signature.
      // - `token`: The token extracted from the header.
      // - `process.env.JWT_SECRET`: The same secret key that was used to sign the token.
      // If the token is invalid (e.g., expired or tampered with), this function will throw an error.
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. GET USER FROM TOKEN
      // The `decoded` payload contains the user's ID (which we put there when we signed it).
      // We use this ID to find the user in the database.
      // `.select('-password')` is a projection that excludes the `password` field from the
      // returned user document for security.
      req.user = await User.findById(decoded.id).select("-password");

      // 4. PROCEED TO THE NEXT MIDDLEWARE/ROUTE HANDLER
      // `next()` passes control to the next function in the request-response cycle.
      next();
    } catch (error) {
      // This block runs if `jwt.verify()` fails.
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, Token failed");
    }
  }

  // If there's no token in the header at all, the request is unauthorized.
  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

// --- EXPORT ---
module.exports = { protect };
