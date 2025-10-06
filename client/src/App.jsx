// c:\Users\sburm\OneDrive\Desktop\Practice-dev\mern-contact-list\client\src\App.jsx

// --- IMPORTS ---
// This section brings in the necessary code modules and assets from other files.

// Line 5: Imports the core React library and two specific "Hooks" from it.
// - `React`: The fundamental library for creating user interfaces with components.
// - `useState`: A Hook that lets you add state to functional components. State is data that can change over time and causes the component to re-render when it does.
// - `useEffect`: A Hook for handling "side effects" in your components. Side effects are operations that interact with the outside world, such as fetching data from an API, setting up subscriptions, or manually changing the DOM.
import React, { useState, useEffect } from "react";

// Line 10: Imports the CSS styles defined in `App.css`. In a modern setup with a bundler like Vite, this CSS will be processed and applied to the components in this file, scoping styles or making them global as configured.
import "./App.css";

// Line 12: Imports the `ContactForm` component from its file. This is a core concept of React called "composition", where we build complex UIs by nesting smaller, reusable components inside larger ones. `App` is the parent, and `ContactForm` will be its child.
import ContactForm from "./components/ContactForm";
import Login from "./components/Login";
import Register from "./components/Register";
import { useAuth } from "./context/AuthContext";
import ContactEditForm from "./components/ContactEditForm";
import { Fragment } from "react";

// --- CONSTANTS ---

// Line 17: Defines the base URL for your backend API. Storing this in a constant is a best practice. It avoids "magic strings" (hardcoded values scattered in the code), makes the URL easy to find and change, and improves readability. In a production application, this would typically be loaded from an environment variable for better security and configuration management (e.g., `process.env.VITE_API_URL`).
const API_URL = "http://localhost:5000/api/contacts";

// The main App component for the application.
function App() {
  // --- STATE MANAGEMENT ---
  // This section uses the `useState` Hook to declare variables that will hold the component's state.
  const { user, logout } = useAuth();
  // Line 25: Initializes a state variable named `contacts`.
  // - `contacts`: This variable will hold the array of contact objects fetched from the API. It's initialized to an empty array `[]`.
  // - `setContacts`: This is the *only* function you should use to update the `contacts` state. Calling `setContacts(newContacts)` tells React to replace the old state with the new one and schedule a re-render of the component to reflect the change.
  // - `useState([])`: This is the Hook call itself, setting the initial value of `contacts` to an empty array.
  const [contacts, setContacts] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [editingContact, setEditingContact] = useState(null);

  // Line 31: Initializes a state variable named `loading`. This is a common and very useful pattern for managing UI during asynchronous operations.
  // - `loading`: A boolean flag that tracks whether we are currently waiting for data from the API.
  // - `setLoading`: The function to toggle the `loading` state.
  // - `useState(true)`: We initialize it to `true` because as soon as the component renders for the first time, we will immediately start fetching data.
  const [loading, setLoading] = useState(true);

  const getAuthHeader = () => {
    if (!user || !user.token) {
      return {};
    }
    return {
      Authorization: `Bearer ${user.token}`,
    };
  };

  // --- DATA FETCHING (SIDE EFFECT) ---

  // Line 37: The `useEffect` Hook is used to perform the initial data fetch from the API.
  // The first argument is a function (the "effect") that will be executed by React.
  // The second argument is a "dependency array" (`[]`), which is crucial. An empty array tells React to run this effect **only once**, right after the component is first rendered to the DOM. This mimics the `componentDidMount` lifecycle method in older class-based components.
  useEffect(() => {
    if (!user) {
      // Don't fetch if not logged in
      setContacts([]);
      setLoading(false);
      return;
    }

    // Line 40: We define an `async` function inside the effect. The effect function itself cannot be async if it needs to return a cleanup function. The standard pattern is to define an async function inside and then call it.
    const fetchContacts = async () => {
      // Line 42: A `try...catch...finally` block is used for robust error handling during the asynchronous operation.
      try {
        // Line 44: The `fetch` API is used to make a GET request to our backend. The `await` keyword pauses the `fetchContacts` function's execution until the network request completes and the Promise resolves with a `Response` object.
        const response = await fetch(API_URL, { headers: getAuthHeader() });

        // Line 47: It's critical to check if the HTTP response was successful. `response.ok` is a boolean that is `true` for status codes in the 200-299 range. If the server returns an error (like 404 Not Found or 500 Internal Server Error), `fetch` does NOT throw an error itself, so we must check and throw one manually.
        if (!response.ok) {
          // Line 49: If the response is not 'ok', we create and throw a new Error. This immediately stops the execution of the `try` block and jumps to the `catch` block.
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Line 53: If the response was successful, we need to parse its body. `response.json()` is an async method that reads the response stream to completion and parses the body text as JSON.
        const data = await response.json();

        // Line 55: We call `setContacts` with the data from the API. This updates our component's state, and React will re-render the `App` component, this time with the `contacts` array populated.
        setContacts(data);
      } catch (error) {
        // Line 58: This block catches any errors thrown in the `try` block (e.g., network failure, or the error we threw from `!response.ok`). We log it to the console for debugging. In a real app, you might set an error state here to show a message to the user.
        console.error("Failed to fetch contacts:", error);
      } finally {
        // Line 61: The `finally` block *always* executes, regardless of whether the `try` block succeeded or the `catch` block was triggered. This is the perfect place to update our loading status.
        // We call `setLoading(false)` to indicate that the data fetching process is complete. This will trigger another re-render, hiding the "Loading..." message.
        setLoading(false);
      }
    };


    // Line 67: We call the async function we just defined to kick off the data fetching process.
    fetchContacts();
  }, [user]); // The empty dependency array `[]` ensures this entire `useEffect` block runs only once.

  // --- EVENT HANDLERS ---

  const handleUpdate = (updatedContact) => {
    setContacts((prevContacts) =>
      prevContacts.map((contact) =>
        contact._id === updatedContact._id ? updatedContact : contact
      )
    );
    // Exit editing mode after successful update
    setEditingContact(null);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: getAuthHeader(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete contact");
      }

      setContacts((prevContacts) =>
        prevContacts.filter((contact) => contact._id !== id)
      );
    } catch (error) {
      // More user-friendly error handling
      console.error("Error deleting contact:", error);
      alert(`Error: ${error.message}`);
    }
  };

  // Line 72: This function will be passed down to the `ContactForm` component as a prop. It allows the child component to communicate back up to its parent. This pattern is called "lifting state up".
  const handleContactCreated = (newContact) => {
    // Line 74: We update the `contacts` state. It's crucial to treat state as immutable in React. We don't push to the existing array. Instead, we create a *new* array.
    // The updater function `(prevContacts) => [...]` is the safest way to update state that depends on the previous state.
    // `...prevContacts`: This is the "spread syntax", which creates a shallow copy of all items from the previous contacts array.
    // `newContact`: We add the new contact object (received from the child component) to the end of this new array.
    // The new array is then passed to `setContacts`, triggering a re-render to display the updated list.
    setContacts((prevContacts) => [...prevContacts, newContact]);
  };

  // --- CONDITIONAL RENDERING ---

  if (!user) {
    return (
      <div className="container">
        <h1>MERN Contact List (Secured)</h1>
        {showRegister ? (
          <Register onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <Login onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }
  // Line 81: This is a conditional rendering block. It checks the `loading` state variable. While `loading` is `true`, the component will return this simple JSX, showing a "Loading..." message to the user. The code below this block will not be executed yet.
  if (loading) {
    return <h1>Loading Contacts...</h1>;
  }

  // --- RENDER LOGIC ---
  // This is the JSX that gets rendered to the screen once `loading` is `false`.

  return (
    <div className="container">
      {editingContact ? (
        // If we are in "edit mode", show only the edit form
        <ContactEditForm
          currentContact={editingContact}
          onUpdate={handleUpdate}
          onCancel={() => setEditingContact(null)}
        />
      ) : (
        // Otherwise, show the main view with the create form and contact list
        <Fragment>
          <h1>MERN Contact List</h1>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <button onClick={logout}>Logout ({user.name})</button>{" "}
            {/* Logout button */}
          </div>          <ContactForm onContactCreated={handleContactCreated} />
          <p>Total Contacts: {contacts.length}</p>
          <div className="contact-list">
            {Array.isArray(contacts) && contacts.map((contact) => (
              <div key={contact._id} className="contact-card">
                <h3>{contact.name}</h3>
                <p>Email: {contact.email}</p>
                <p>Phone: {contact.phone}</p>
                <button
                  onClick={() => setEditingContact(contact)}
                  style={{
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    marginRight: "10px",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact._id)}
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </Fragment>
      )}
    </div>
  );
}

// --- EXPORT ---

// Line 115: This makes the `App` component available for other files to import. In this project, it's imported by `client/src/main.jsx`, which is the entry point that renders the entire application into the DOM.
export default App;
