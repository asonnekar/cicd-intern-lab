// index.js — Our simple Express API

const express = require('express');
const app = express();

// Route 1: Home route
app.get('/', (req, res) => {
    res.json({ message: 'Hello from CI/CD Lab - v2!', status: 'ok' });
});

// Route 2: Health check route (useful for monitoring)
app.get('/health', (req, res) => {
    res.json({ status: 'healthy' });
});

// Route 3: Add two numbers
app.get('/add/:a/:b', (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    res.json({ result: a + b });
});
// Route 4: Goodbye
app.get('/goodbye', (req, res) => {
    res.json({ message: 'Goodbye! See you next time.' });
});

// Route 5: Multiply 2 numbers
app.get('/multiply/:a/:b', (req, res) => {
    const a = parseInt(req.params.a);
    const b = parseInt(req.params.b);
    res.json({ result: a * b });
});

// Start the server only if this file is run directly (not during tests)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

// Export the app so tests can use it
module.exports = app;