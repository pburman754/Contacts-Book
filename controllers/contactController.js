// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\controllers\contactController.js

// Line 1: Imports the Mongoose model for the 'Contact' collection. This model
// provides the methods needed to interact with the contacts in the database (find, create, etc.).
const Contact = require("../models/Contact");

// --- Get all contacts ---
// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Public
const getContacts = async (req, res) => {
  try {
    // Line 9: Uses the Mongoose model's .find() method to retrieve all documents
    // from the 'contacts' collection. The `await` keyword pauses execution until
    // the database query is complete.
    const contacts = await Contact.find();
    
    // Line 11: If successful, it sends a 200 (OK) HTTP status code along with the
    // array of contacts in JSON format as the response body.
    res.status(200).json(contacts);
  } catch (error) {
    // Line 14: If any error occurs during the database query, it's caught here.
    // It sends a 500 (Internal Server Error) status and a JSON object with the error message.
    res.status(500).json({ message: error.message });
  }
};

// --- Create a new contact ---
// @desc    Create a new contact
// @route   POST /api/contacts
// @access  Public
const createContact = async (req, res) => {
  try {
    // Line 25: Destructures the `name`, `email`, and `phone` fields from the
    // request body (`req.body`). This data is sent from the React form.
    const { name, email, phone } = req.body;
    
    // Line 27-32: Uses the Mongoose model's .create() method to create and save a
    // new contact document in the database with the data from the request.
    const contact = await Contact.create({
      name,
      email,
      phone,
    });
    
    // Line 34: If the document is created successfully, it sends a 201 (Created)
    // status code and the newly created contact object as the JSON response.
    res.status(201).json(contact);
  } catch (error) {
    // Line 37: If an error occurs (e.g., a required field is missing, or the email
    // is not unique, as defined in your schema), Mongoose will throw an error.
    // This sends a 400 (Bad Request) status and the error message.
    res.status(400).json({ message: error.message });
  }
};

// --- Update a contact ---
// @desc    Update a contact
// @route   PUT /api/contacts/:id
// @access  Public
const updateContact = async (req, res) => {
  try {
    // Line 48: First, it tries to find the contact by its unique ID, which is
    // extracted from the URL parameters (`req.params.id`).
    const contact = await Contact.findById(req.params.id);
    
    // Line 49-52: If no contact with that ID is found, it returns a 404 (Not Found)
    // status with a clear error message.
    if (!contact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    
    // Line 54-61: If the contact is found, it uses .findByIdAndUpdate() to update it.
    // - req.params.id: The document to update.
    // - req.body: The new data to apply.
    // - { new: true, runValidators: true }: Options. `new: true` ensures the
    //   updated document is returned, and `runValidators: true` makes sure the
    //   update abides by your schema validation rules (e.g., required fields).
    const updateContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    
    // Line 63: Sends a 200 (OK) status with the updated contact object.
    res.status(200).json(updateContact);
  } catch (error) {
    // Line 66: Catches errors (like validation errors) and returns a 400 (Bad Request).
    res.status(400).json({ message: error.message });
  }
};

// --- Delete a contact ---
// @desc    Delete a contact
// @route   DELETE /api/contacts/:id
// @access  Public
const deleteContact = async (req, res) => {
    try{
        // Line 77: Finds the contact by ID to ensure it exists before trying to delete it.
        const contact = await Contact.findById(req.params.id);
        
        // Line 78-81: If it doesn't exist, returns a 404 (Not Found).
        if(!contact){
            return res.status(404).json({message:"Contact not found"});
        }
        
        // Line 83: If the contact exists, it's deleted from the database.
        await Contact.deleteOne({ _id: req.params.id });
        
        // Line 85: Sends a 200 (OK) status with a success message.
        res.status(200).json({message:"Contact removed Successfully"});
    }catch(error){
        // Line 88: Catches any other errors and returns a 400 (Bad Request).
        res.status(400).json({message:error.message});
    }
};

// Line 93-99: Exports all the handler functions so they can be imported and used
// in `server.js` to define the API routes.
module.exports = {
  getContacts,
  createContact,
  updateContact,
  deleteContact
};
