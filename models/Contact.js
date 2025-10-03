const mongoose = require("mongoose"); // Imports the Mongoose library

// Defines the schema for the 'Contact' collection in MongoDB
const contactSchema = mongoose.Schema(
  {
    // Defines the 'name' field for the contact
    name: {
      type: String, // The data type is a string
      required: [true, "Please add a name"], // This field is required, with a custom error message if not provided
      trim: true, // Automatically removes leading and trailing whitespace
    },
    // Defines the 'email' field for the contact
    email: {
      type: String, // The data type is a string
      required: [true, "Please add an email"], // This field is required
      unique: true, // Ensures that every email in the collection is unique
    },
    // Defines the 'phone' field for the contact
    phone: {
      type: String, // The data type is a string
      default: "N/A", // Sets a default value of "N/A" if no phone number is provided
    },
  },
  {
    // Mongoose option to automatically add 'createdAt' and 'updatedAt' fields
    timestamps: true, 
  }
);

// Exports the Mongoose model for the 'Contact' collection, using the schema defined above
module.exports = mongoose.model("Contact", contactSchema);
