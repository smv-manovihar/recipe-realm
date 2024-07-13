// server.js

const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

const LLM1_URL = 'http://localhost:5002';
const LLM2_URL = 'http://localhost:5001';

app.post('/api/query', async (req, res) => {
    const { llm, query } = req.body;

    try {
        const url = llm === 'llm1' ? `${LLM1_URL}/query` : `${LLM2_URL}/query`;
        const response = await axios.post(url, { query });
        res.json(response.data);
    } catch (error) {
        console.error('Error querying LLM:', error);
        res.status(500).json({ error: 'Error querying LLM' });
    }
});

app.post('/api/generate', async (req, res) => {
    const { llm, context, prompt } = req.body;

    try {
        const url = llm === 'llm1' ? `${LLM1_URL}/generate` : `${LLM2_URL}/generate`;
        const response = await axios.post(url, { context, prompt });
        res.json(response.data);
    } catch (error) {
        console.error('Error generating response:', error);
        res.status(500).json({ error: 'Error generating response' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
