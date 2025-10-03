// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\models\Contact.js

// --- IMPORTS ---

const mongoose = require("mongoose"); // Imports the Mongoose library

// --- SCHEMA DEFINITION ---
// A Mongoose schema defines the structure of the document, default values, validators, etc.
const contactSchema = mongoose.Schema(
  {
    // This field establishes a relationship between the 'Contact' and 'User' models.
    user: {
      // `type`: Specifies that this field will store a MongoDB ObjectId.
      type: mongoose.Schema.Types.ObjectId,
      // `required`: This field must have a value.
      required: true,
      // `ref`: This tells Mongoose which model to use during population. In this case,
      // the ObjectId stored in this field refers to a document in the 'User' collection.
      ref: "User",
    },

    // Defines the 'name' field for the contact
    name: {
      type: String, // The data type is a string
      required: [true, "Please add a name"], // This field is required, with a custom error message if not provided
      trim: true, // A schema modifier that automatically removes leading and trailing whitespace from the string.
    },
    // Defines the 'email' field for the contact
    email: {
      type: String, // The data type is a string
      required: [true, "Please add an email"], // This field is required
      // `unique: true`: This creates a unique index on the `email` field. It ensures that
      // no two documents in the collection can have the same email address.
      unique: true,
    },
    // Defines the 'phone' field for the contact
    phone: {
      type: String, // The data type is a string
      default: "N/A", // Sets a default value of "N/A" if no phone number is provided when a new document is created.
    },
  },
  {
    // Mongoose option to automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true,
  }
);

// --- EXPORT ---
// `mongoose.model()` compiles the schema into a model. A model is a constructor function
// that allows you to create, read, update, and delete documents of a specific type.
// - "Contact": The singular name of the model. Mongoose will automatically look for the
//   plural, lowercased version ("contacts") for the collection name in the database.
module.exports = mongoose.model("Contact", contactSchema);
