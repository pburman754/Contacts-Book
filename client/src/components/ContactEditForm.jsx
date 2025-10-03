import React, { useState } from "react";

const ContactEditForm = ({ currentContact, onUpdate, onCancel }) => {
  const [name, setName] = useState(currentContact.name);
  const [email, setEmail] = useState(currentContact.email);
  const [phone, setPhone] = useState(currentContact.phone);
  const API_URL = "http://localhost:5000/api/contacts";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updateData = { name, email, phone };
    try {
      const response = await fetch(`${API_URL}/${currentContact._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update contact");
      }
      const updatedContact = await response.json();
      onUpdate(updatedContact);
    } catch (error) {
      alert(`Error updating contact : ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="edit-Form">
      <h2>Edit Contact</h2>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="text"
        placeholder="Phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <div>
        <button type="submit">Save Changes</button>
        <button type="button" onClick={onCancel} style={{ marginLeft: "10px" }}>
          Cancel
        </button>
      </div>
    </form>
  );
};
export default ContactEditForm;
