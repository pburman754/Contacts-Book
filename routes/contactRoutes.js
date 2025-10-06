// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\routes\contactRoutes.js

const express = require("express");
const router = express.Router();
const {
  getContacts,
  createContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const { protect } = require("../middleware/authMiddleware");
const { check } = require("express-validator");

router
  .route("/")
  .get(protect, getContacts)
  .post(
    protect,
    [
      check("name", "Name is required").not().isEmpty(),
      check("email", "Please include a valid email").isEmail(),
    ],
    createContact
  );

router
  .route("/:id")
  .put(
    protect,
    [check("email", "Please include a valid email").optional().isEmail()],
    updateContact
  )
  .delete(protect, deleteContact);

module.exports = router;