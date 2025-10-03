// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\client\src\components\ContactForm.jsx

// --- IMPORTS ---
// Line 4: Imports the core React library and the `useState` Hook.
// - `React`: The fundamental library for creating user interfaces with components.
// - `useState`: A Hook that lets you add state to functional components. We'll use it to manage the values of the form inputs.
import React, { useState } from 'react';

// --- COMPONENT DEFINITION ---

// Line 9: Defines the `ContactForm` functional component.
// It uses "destructuring" to get the `onContactCreated` prop directly. This prop is a function passed down from the parent component (`App.jsx`).
// This is a key pattern for child-to-parent communication in React.
const ContactForm = ({ onContactCreated }) => {
  // --- STATE MANAGEMENT ---
  // This section uses the `useState` Hook to create "state variables" for each input field.
  // This makes the form a "controlled component", where React state is the single source of truth for the input values.

  // Line 15: Initializes a state variable `name`.
  // - `name`: Holds the current value of the name input. Initialized to an empty string `''`.
  // - `setName`: The function to call to update the `name` state.
  const [name, setName] = useState('');

  // Line 19: Initializes a state variable `email`.
  const [email, setEmail] = useState('');

  // Line 22: Initializes a state variable `phone`.
  const [phone, setPhone] = useState('');

  // --- CONSTANTS ---
  // Line 25: Defines the API endpoint for creating contacts.
  const API_URL = 'http://localhost:5000/api/contacts';

  // --- EVENT HANDLERS ---

  // Line 28: Defines an `async` function to handle the form's submission event.
  const handleSubmit = async (e) => {
    // Line 29: `e.preventDefault()` is crucial. It stops the browser's default behavior of performing a full-page reload when a form is submitted.
    // This allows us to handle the submission with our own JavaScript logic without losing the application's state.
    e.preventDefault();

    // Line 32: A `try...catch` block is used to handle potential errors during the asynchronous API call, such as network issues or server-side errors.
    try {
      // Line 34: The `fetch` API is used to send a request to the backend.
      // - The first argument is the API URL.
      // - The second argument is an options object that configures the request.
      const response = await fetch(API_URL, {
        // Line 36: `method: 'POST'` specifies that this is a request to create a new resource on the server.
        method: 'POST',
        headers: {
          // Line 38: This header is essential. It tells the Express server that the body of this request is in JSON format.
          // The `express.json()` middleware on the server will use this to correctly parse the incoming data.
          'Content-Type': 'application/json',
        },
        // Line 41: The `body` of the request contains the data to be sent.
        // `JSON.stringify` converts the JavaScript object `{ name, email, phone }` (created from our state variables) into a JSON string, which is the standard format for sending data in an API request body.
        body: JSON.stringify({ name, email, phone }),
      });

      // Line 44: Checks if the HTTP response status code is not in the 200-299 range (e.g., a 400 Bad Request from server-side validation, or a 500 Internal Server Error).
      if (!response.ok) {
        // Line 46: If the response is an error, we try to parse the JSON body of the error response, which should contain a `message` field from our backend.
        const errorData = await response.json();
        // Line 47: We throw a new Error. This immediately stops the `try` block and transfers control to the `catch` block below.
        throw new Error(errorData.message || 'Failed to create contact');
      }

      // Line 50: If the request was successful, `response.json()` parses the JSON body of the success response, which contains the newly created contact object from the server.
      const newContact = await response.json();

      // Line 53: This is the "lifting state up" part. We call the `onContactCreated` function that was passed as a prop from `App.jsx`.
      // We pass the `newContact` object, which allows the parent component to update its own state and re-render the contact list with the new item.
      onContactCreated(newContact); 

      // Line 56-58: After a successful submission, we reset the form by clearing the state variables. This clears the input fields in the UI.
      setName('');
      setEmail('');
      setPhone('');

    } catch (error) {
      // Line 61: This block catches any error thrown from the `try` block (e.g., network failure, server error).
      // It displays the error message to the user in a simple `alert` dialog.
      alert(`Error: ${error.message}`);
    }
  };

  // --- RENDER LOGIC (JSX) ---
  // This is the JSX that defines the HTML structure of the form.

  return (
    // Line 68: The `onSubmit` event of the form is linked to our `handleSubmit` function.
    <form onSubmit={handleSubmit} className="contact-form">
      <h2>Add New Contact</h2>
      {/* Each input is a "controlled component". Its value is controlled by React state. */}
      <input 
        type="text" 
        placeholder="Name (Required)" 
        // Line 74: The `value` of the input is directly tied to the `name` state variable.
        value={name}
        // Line 76: The `onChange` event fires every time the user types in the input.
        // `e.target.value` contains the current text in the input field.
        // We call `setName` to update the state, which causes React to re-render the component with the new input value.
        onChange={(e) => setName(e.target.value)}
        required 
      />
      &nbsp; &nbsp; &nbsp;
      <input 
        type="email" 
        placeholder="Email (Required)" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />
      &nbsp;&nbsp;&nbsp;
      <input 
        type="text" 
        placeholder="Phone (Optional)" 
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
      />
      <br /><br />
      <button type="submit">Create Contact</button>
    </form>
  );
};

export default ContactForm;