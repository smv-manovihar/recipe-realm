

import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage';
import Chatbot from './components/Chatbot';

const App = () => {
  const [showChatbot, setShowChatbot] = useState(false);

  const handleSearchClick = () => {
    setShowChatbot(true);
  };

  return (
    <Routes>
      <Route path="/" element={<HomePage onSearchClick={handleSearchClick} />} />
      <Route path="/chat" element={<Chatbot />} />
    </Routes>
  );
};

export default App;
