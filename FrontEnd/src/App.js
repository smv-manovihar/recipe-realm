// src/App.js

import React, { useState } from 'react';
import axios from 'axios';
import RecipeCard from './RecipeCard';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
    const [llm, setLlm] = useState('llm1');
    const [ingredients, setIngredients] = useState('');
    const [userInput, setUserInput] = useState('');
    const [response, setResponse] = useState('');
    const [recipes, setRecipes] = useState([]);
    const [visibleRecipes, setVisibleRecipes] = useState(3);  // Number of recipes to display initially
    const [chatHistory, setChatHistory] = useState([]);

    const handleQuery = async () => {
        try {
            const result = await axios.post('http://localhost:3001/api/query', {
                llm,
                query: ingredients
            });
            setRecipes(result.data.recipes || []);
            setResponse(result.data.context || '');
            setVisibleRecipes(3); // Reset visible recipes when a new query is made
            setChatHistory([...chatHistory, { type: 'user', message: ingredients }, { type: 'llm', message: result.data.context || '' }]);
        } catch (error) {
            console.error('Error querying LLM:', error);
        }
    };

    const handleGenerate = async () => {
        try {
            const result = await axios.post('http://localhost:3001/api/generate', {
                llm,
                context: response,
                prompt: userInput
            });
            setResponse(result.data.response);
            setChatHistory([...chatHistory, { type: 'user', message: userInput }, { type: 'llm', message: result.data.response }]);
        } catch (error) {
            console.error('Error generating response:', error);
        }
    };

    const handleLoadMore = () => {
        setVisibleRecipes((prevVisible) => prevVisible + 3);
    };

    return (
        <div className="App container">
            <h1 className="my-4">Recipe Finder</h1>
            <div className="mb-3">
                <label htmlFor="llmSelect" className="form-label">Select LLM:</label>
                <select id="llmSelect" className="form-select" value={llm} onChange={(e) => setLlm(e.target.value)}>
                    <option value="llm1">GeminAI</option>
                    <option value="llm2">Cohere</option>
                </select>
            </div>
            <div className="mb-3">
                <label htmlFor="ingredientsInput" className="form-label">Enter ingredients:</label>
                <input
                    id="ingredientsInput"
                    type="text"
                    className="form-control"
                    value={ingredients}
                    onChange={(e) => setIngredients(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleQuery}>Get Recipes</button>
            </div>
            <div className="recipes mb-4">
                {recipes.slice(0, visibleRecipes).map((recipe, index) => (
                    <RecipeCard key={index} recipe={recipe} />
                ))}
                {visibleRecipes < recipes.length && (
                    <button className="btn btn-secondary mt-3" onClick={handleLoadMore}>Load More</button>
                )}
            </div>
            <div className="mb-3">
                <label htmlFor="questionInput" className="form-label">Ask a question:</label>
                <input
                    id="questionInput"
                    type="text"
                    className="form-control"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                />
                <button className="btn btn-primary mt-2" onClick={handleGenerate}>Generate Response</button>
            </div>
            <div className="response">
                <h2>Response:</h2>
                {chatHistory.map((chat, index) => (
                    <div key={index} className={`chat-bubble ${chat.type}`}>
                        <p>{chat.message}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
