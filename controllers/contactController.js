// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\controllers\contactController.js

// --- IMPORTS ---

// Imports the Mongoose model for the 'Contact' collection. This model
// provides the methods needed to interact with the contacts in the database (e.g., `find`, `create`).
const Contact = require("../models/Contact");
// `express-async-handler`: A utility middleware for Express that wraps async route handlers.
// It catches any errors thrown in async functions and passes them to the Express error
// handling middleware, so you don't need to write `try...catch` blocks in every controller.
const asyncHandler = require("express-async-handler");

// --- CONTROLLER FUNCTIONS ---

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Private (requires authentication)
const getContacts = asyncHandler(async (req, res) => {
  // `req.user` is attached to the request object by the `protect` middleware.
  // It contains the authenticated user's document from the database.
  // We use `req.user.id` to find only the contacts that belong to this user.
  const contacts = await Contact.find({ user: req.user.id });

  // If successful, send a 200 (OK) HTTP status code along with the
  // array of contacts in JSON format as the response body.
  res.status(200).json(contacts);
});

// --- Create a new contact ---
// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Private
const createContact = asyncHandler(async (req, res) => {
  // Destructures the `name`, `email`, and `phone` fields from the
  // request body (`req.body`). This data is sent from the frontend form.
  const { name, email, phone } = req.body;

  // Basic validation to ensure required fields are present.
  if (!name || !email) {
    // If validation fails, set the HTTP status to 400 (Bad Request)
    // and throw an error. `asyncHandler` will catch this and send an error response.
    res.status(400);
    throw new Error("Please include a name and email");
  }

  // Uses the Mongoose model's `.create()` method to create and save a
  // new contact document in the database with the data from the request.
  // We also associate the contact with the logged-in user via `req.user._id`.
  const contact = await Contact.create({
    user: req.user._id,
    name,
    email,
    phone,
  });

  // If the document is created successfully, send a 201 (Created)
  // status code and the newly created contact object as the JSON response.
  res.status(201).json(contact);
});

// --- Update a contact ---
// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Private
const updateContact = asyncHandler(async (req, res) => {
  // First, it tries to find the contact by its unique ID, which is
  // extracted from the URL parameters (`req.params.id`).
  const contact = await Contact.findById(req.params.id);

  // If no contact with that ID is found, return a 404 (Not Found) status.
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  // Authorization check: Ensure the user trying to update the contact
  // is the one who created it.
  // `contact.user` is an ObjectId, so we convert both it and `req.user._id`
  // to strings for a reliable comparison.
  if (contact.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to update this contact");
  }

  // If the contact is found and the user is authorized, use `.findByIdAndUpdate()` to update it.
  // - `req.params.id`: The document to update.
  // - `req.body`: The new data to apply.
  // - `{ new: true, runValidators: true }`: Options.
  //   - `new: true` ensures the updated document is returned in the response.
  //   - `runValidators: true` makes sure the update abides by your schema validation rules.
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  // Send a 200 (OK) status with the updated contact object.
  res.status(200).json(updatedContact);
});

// --- Delete a contact ---
// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Private
const deleteContact = asyncHandler(async (req, res) => {
  // Finds the contact by ID to ensure it exists before trying to delete it.
  const contact = await Contact.findById(req.params.id);

  // If it doesn't exist, return a 404 (Not Found).
  if (!contact) {
    res.status(404);
    throw new Error("Contact not found");
  }

  // Authorization check: Ensure the user trying to delete the contact is the one who created it.
  if (contact.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("Not authorized to delete this contact");
  }

  // If the contact exists and the user is authorized, it's deleted from the database.
  await Contact.deleteOne({ _id: req.params.id });

  // Send a 200 (OK) status with a success message.
  res.status(200).json({ message: "Contact removed Successfully" });
});

// --- EXPORTS ---
// Exports all the handler functions so they can be imported and used in `server.js` to define the API routes.
module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
};
