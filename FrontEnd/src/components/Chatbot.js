import React, { useState } from 'react'; // Importing React and the useState hook
import axios from 'axios'; // Importing axios to make HTTP requests
import 'bootstrap/dist/css/bootstrap.min.css'; // Importing Bootstrap CSS for styling
import './Chatbot.css'; // Importing custom CSS for the chatbot

const Chatbot = () => {
  const [input, setInput] = useState(''); // State to hold user input
  const [messages, setMessages] = useState([]); // State to hold chat messages

  // Handle input change event
  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  // Handle send button click or Enter key press
  const handleSend = async () => {
    if (input.trim()) {
      const userMessage = { text: input, user: true }; // User's message
      setMessages([...messages, userMessage]); // Add user's message to the state

      try {
        // Send the user input to the server
        const response = await axios.post('/api/chat', {
          user_input: input,
          context: messages.map(msg => msg.text).join('\n') // Concatenate all previous messages for context
        });

        const botResponse = { text: response.data.response, user: false }; // Bot's response
        setMessages([...messages, userMessage, botResponse]); // Add both messages to the state

      } catch (error) {
        console.error('Error sending message:', error);
      }

      setInput(''); // Clear the input field
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
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
            <div className="message-box">
              <div className="message-text">{msg.text}</div>
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
