const express = require('express'); // Importing the Express framework
const axios = require('axios'); // Importing axios to make HTTP requests
const path = require('path'); // Importing path to handle and transform file paths
const app = express(); // Creating an Express application

const ngrokUrl = "https://6aa3-34-145-94-63.ngrok-free.app"; // Replace this with your ngrok URL

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(express.static(path.join(__dirname, 'build'))); // Serve static files from the React app's build directory

// API endpoint to handle chat requests
app.post('/api/chat', async (req, res) => {
  try {
    // Forward the request to the Flask backend using ngrok URL
    const response = await axios.post(`${ngrokUrl}/chat`, req.body);
    // Send the response back to the React frontend
    res.json(response.data);
  } catch (error) {
    console.error('Error in /api/chat:', error);
    // Send an error response if the request fails
    res.status(500).json({ error: 'Failed to process request' });
  }
});

// Serve the React app's main HTML file for any other requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const port = process.env.PORT || 3000; // Define the port the server will run on
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
