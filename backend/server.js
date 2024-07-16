// server.js

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const LLM1_URL = "http://localhost:5002"; //gemini
const LLM2_URL = "https://3048-34-16-130-184.ngrok-free.app"; //llama

app.post("/api/query", async (req, res) => {
  const { llm, query } = req.body;

  try {
    const url = llm === "GeminiAI" ? `${LLM1_URL}/query` : `${LLM2_URL}/query`; //changed
    const response = await axios.post(url, { query });
    res.json(response.data);
  } catch (error) {
    console.error("Error querying LLM:", error);
    res.status(500).json({ error: "Error querying LLM" });
  }
});

app.post("/api/generate", async (req, res) => {
  const { llm, context, prompt } = req.body;

  try {
    const url =
      llm === "GeminiAI" ? `${LLM1_URL}/generate` : `${LLM2_URL}/generate`; //changed
    const response = await axios.post(url, { context, prompt });
    res.json(response.data);
  } catch (error) {
    console.error("Error generating response:", error);
    res.status(500).json({ error: "Error generating response" });
  }
});

app.get("/api/loadmore", async (req, res) => {
  const llm = req.query.llm; // Get the 'llm' parameter from the query string

  try {
    const url = llm === "GeminiAI" ? `${LLM1_URL}/loadmore` : `${LLM2_URL}/loadmore`;
    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error("Error in loading more:", error);
    res.status(500).json({ error: "Error loading more" });
  }
});;
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
