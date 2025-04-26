const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Serve static files from the 'templates' directory
app.use(express.static(path.join(__dirname, 'templates')));

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/craftgen', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Import Routes
const authRoute = require('./routes/auth');

// Route Middleware
app.use('/api', authRoute);

// Static HTML Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'home.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'login.html'));
});

app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'profile.html'));
});

app.get('/scheduling', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'scheduling.html'));
});

app.get('/sch', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'sch.html'));
});
/*
app.get('/chat', async (req, res) => {
    try {
        // Proxy the request to the Flask app running on port 5000
        const response = await axios.get('http://127.0.0.1:5000/chat');
        // Send the response from Flask back to the client
        res.send(response.data);
    } catch (error) {
        console.error('Error fetching chat from Flask app:', error);
        res.status(500).send('Error fetching chat from the AI service.');
    }
});

const fetchAIContent = async (domain, prompt) => {
    try {
        const response = await axios.post('http://localhost:5000/generate-content', {
            domain: domain,
            prompt: prompt
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching AI content:', error);
        return null;
    }
};

// Example usage:
app.post('/generate-content', async (req, res) => {
    const { domain, prompt } = req.body;
    const aiContent = await fetchAIContent(domain, prompt);

    if (aiContent) {
        res.json(aiContent);
    } else {
        res.status(500).send('Error generating content');
    }
});*/

// Route to serve chat page
app.get('/chat', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates', 'chat.html'));
});

// Route to handle content generation request
app.post('/generate-content', async (req, res) => {
    const { domain, prompt } = req.body;

    try {
        const response = await axios.post('http://127.0.0.1:5000/generate-content', {
            domain,
            prompt
        });
        res.json(response.data);
    } catch (error) {
        console.error('Error generating content:', error.message);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
