import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import Chatbot from './components/Chatbot';
import { AnimatePresence } from 'framer-motion';
const App = () => {
  const location = useLocation();
  // const [showChatbot, setShowChatbot] = useState(false);

  const handleSearchClick = () => {
    // setShowChatbot(true);
  };
  const handleHomeClick = () => {
    // setShowChatbot(true);
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage onSearchClick={handleSearchClick} />} />
        <Route path="/chat" element={<Chatbot onHomeClick={handleHomeClick} />} />
      </Routes>
    </AnimatePresence>
  );
};

export default App;
