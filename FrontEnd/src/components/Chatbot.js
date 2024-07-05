import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Chatbot.css';
import chef from './images/p4.png'; 

const Chatbot = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, user: true };
      setMessages([...messages, userMessage]);
      
      try {
        const response = await axios.post('/api/chat', {
          user_input: input,
          context: messages.map(msg => msg.text).join('\n')
        });

        const botResponse = { text: response.data.response, user: false };
        setMessages([...messages, userMessage, botResponse]);
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  const handleLoadMore = async () => {
    try {
      const moreRecipes = await axios.get('/api/recipes'); // Replace with actual endpoint for fetching more recipes
      
      const lastMessage = messages[messages.length - 1];
      if (lastMessage && lastMessage.recipes) {
        const updatedRecipes = [...lastMessage.recipes, ...moreRecipes.data.recipes];
        lastMessage.recipes = updatedRecipes;
        setMessages([...messages.slice(0, -1), lastMessage]);
      }
    } catch (error) {
      console.error('Error loading more recipes:', error);
    }
  };

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <h1 className="display-4">Recipe Chatbot</h1>
      </header>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.user ? 'user' : 'bot'}`}>
            <div className="message-box-container">
              {!msg.user && (
                <div className="chef-image">
                  <img src={chef} alt="Chef" />
                </div>
              )}
              <div className={`message-box ${msg.user ? 'user-box' : 'bot-box'}`}>
                {msg.text}
                {msg.recipes && (
                  <div className="recipes">
                    {msg.recipes.map((recipe, recipeIndex) => (
                      <div key={recipeIndex} className="recipe">
                        <h5>{recipe.name}</h5>
                        <p>{recipe.details}</p>
                        <img src={recipe.image} alt={recipe.name} />
                      </div>
                    ))}
                    <button className="btn btn-secondary" onClick={handleLoadMore}>Load More</button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="chatbot-input">
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={input}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button className="btn btn-primary" onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;
