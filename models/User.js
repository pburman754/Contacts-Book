// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\models\User.js

// --- IMPORTS ---

// Imports the Mongoose library, which is an Object Data Modeling (ODM) library for MongoDB.
// It helps manage data, provides schema validation, and translates between objects in code
// and their representation in MongoDB.
const mongoose = require("mongoose");
// Imports the bcrypt.js library, used for hashing passwords. It's a best practice to never
// store plain-text passwords in a database.
const bcrypt = require("bcryptjs");

// --- SCHEMA DEFINITION ---

// `mongoose.Schema` is the constructor for creating a new schema. A schema defines the
// structure of the documents within a collection, including field types, default values,
// validators, etc.
const userSchema = mongoose.Schema(
  {
    // Defines the 'name' field for the user.
    name: {
      // `type: String`: Specifies that the value of this field must be a string.
      type: String,
      // `required`: A built-in validator. If `true`, this field must have a value when a
      // document is saved. The second element in the array is the custom error message
      // to be returned if the validation fails.
      required: [true, "Please add a name"],
    },
    // Defines the 'email' field for the user.
    email: {
      type: String,
      required: [true, "Please add an email"],
      // `unique: true`: This creates a unique index on the `email` field in the MongoDB
      // collection. It ensures that no two documents in the collection can have the same
      // email address. MongoDB will throw a duplicate key error (E11000) if this
      // constraint is violated.
      unique: true,
    },
    // Defines the 'password' field for the user.
    password: {
      type: String,
      required: [true, "Please add a password"],
    },
  },
  {
    // This is a schema option. When set to `true`, Mongoose automatically adds two
    // fields to the schema: `createdAt` and `updatedAt`.
    // - `createdAt`: A timestamp for when the document was created.
    // - `updatedAt`: A timestamp for when the document was last updated.
    timestamps: true,
  }
);

// --- MIDDLEWARE ---

// `userSchema.pre("save", ...)`: This defines a "pre-save" middleware hook for the `userSchema`.
// This function will be executed *before* a document of this schema is saved to the database
// (e.g., via `doc.save()`). It's the perfect place to hash the password.
userSchema.pre("save", async function (next) {
  // `this` refers to the document being saved.
  // `isModified('password')` checks if the password field has been changed. We only want
  // to re-hash the password if it's new or has been updated. This prevents re-hashing
  // the password on every save operation (like updating a user's name).
  if (!this.isModified("password")) {
    // If the password hasn't been modified, we call `next()` to proceed to the next
    // middleware or the actual save operation without doing anything.
    return next();
  }
  // `bcrypt.genSalt(10)`: Generates a salt with a cost factor of 10. The salt is a random
  // string that is mixed with the password before hashing to protect against rainbow table attacks.
  // The cost factor determines how many rounds of hashing are performed. 10 is a good default.
  const salt = await bcrypt.genSalt(10);
  // `bcrypt.hash()`: Hashes the user's plain-text password (`this.password`) with the generated salt.
  // We then overwrite the plain-text password on the document with the hashed password.
  this.password = await bcrypt.hash(this.password, salt);
  // Call `next()` to continue the save process.
  next();
});

// --- INSTANCE METHODS ---

// `userSchema.methods` is an object where you can add custom methods to your document instances.
// This `matchPassword` method will be available on every user document.
userSchema.methods.matchPassword = async function (enteredPassword) {
  // `bcrypt.compare()`: Securely compares the plain-text password provided by the user
  // (`enteredPassword`) with the hashed password stored in the database (`this.password`).
  // It returns a promise that resolves to `true` if they match and `false` otherwise.
  // It's crucial to use this method instead of hashing the entered password and comparing
  // the hashes directly, as `compare` is designed to be safe against timing attacks.
  return await bcrypt.compare(enteredPassword, this.password);
};

// --- EXPORT ---

// `mongoose.model("User", userSchema)`: Compiles the schema into a Mongoose model.
// A model is a constructor function that allows you to create, read, update, and delete
// documents of a specific type.
// - "User": The singular name of the model. Mongoose will automatically look for the
//   plural, lowercased version of this name for the collection in the database (i.e., "users").
// - `userSchema`: The schema to use for this model.
module.exports = mongoose.model("User", userSchema);
