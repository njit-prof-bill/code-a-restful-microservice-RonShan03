const express = require('express');
const app = express();
const port = 3000;

// to parse JSON bodies
app.use(express.json());

// In-memory storage for users
let users = [];
let nextId = 1; // counter to generate unique IDs

// Create a new user
app.post('/users', (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    const newUser = { id: nextId++, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

// Retrieve user information by ID
app.get('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const user = users.find(u => u.id === userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found.' });
    }

    res.json(user);
});

// Update user information by ID
app.put('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    const { name, email } = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required.' });
    }

    const updatedUser = { id: userId, name, email };
    users[userIndex] = updatedUser;
    res.json(updatedUser);
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
    const userId = parseInt(req.params.id, 10);
    const userIndex = users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found.' });
    }

    users.splice(userIndex, 1);
    res.status(204).send(); // No Content
});

// Update the root route to provide API information
app.get('/', (req, res) => {
    res.send(`
        <h1>API Documentation</h1>
        <h2>Available Routes:</h2>
        <ul>
            <li><strong>POST /users</strong> - Create a new user</li>
            <li><strong>GET /users/:id</strong> - Retrieve user information by ID</li>
            <li><strong>PUT /users/:id</strong> - Update user information by ID</li>
            <li><strong>DELETE /users/:id</strong> - Delete a user by ID</li>
        </ul>
        <h3>Example Request Body for POST /users:</h3>
        <pre>
        {
            "name": "John Doe",
            "email": "john@example.com"
        }
        </pre>
    `);
});

// Start the server (only if not in test mode)
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
    });
}

module.exports = app; // Export the app for testing
