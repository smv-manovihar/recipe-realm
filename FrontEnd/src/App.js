// src/App.js
import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Chatbot from './components/Chatbot';
import './App.css';

const App = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const handleSearchClick = () => {
    setShowChatbot(true);
  };

  return (
    <div className="App">
      {showChatbot ? <Chatbot /> : <HomePage onSearchClick={handleSearchClick} />}
    </div>
  );
};

export default App;
