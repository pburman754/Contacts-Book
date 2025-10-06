// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\client\src\components\ContactForm.jsx

import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createContact } from "../services/apiService";

const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  phone: "",
};

/**
 * A controlled form for creating a new contact.
 * It provides user feedback during submission and displays errors gracefully.
 * @param {object} props - The component props.
 * @param {function(object): void} props.onContactCreated - Callback to lift the new contact state to the parent.
 */
const ContactForm = ({ onContactCreated }) => {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const newContact = await createContact(formData, user.token);
      onContactCreated(newContact);
      setFormData(INITIAL_FORM_STATE); // Reset form on success
    } catch (error) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Add New Contact</h2>
      {error && <p className="form-error">{error}</p>}
      <input
        type="text"
        name="name"
        placeholder="Name (Required)"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email (Required)"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="text"
        name="phone"
        placeholder="Phone (Optional)"
        value={formData.phone}
        onChange={handleChange}
      />
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Creating..." : "Create Contact"}
      </button>
    </form>
  );
};

export default ContactForm;