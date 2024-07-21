 import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import icon from './images/chef.png';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import {motion} from 'framer-motion';
import { distinctFacts } from './funFactsHelper';

const HomePage = ({ onSearchClick }) => {
  const factRefs = useRef([]);
  const leadTextRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {

    // Animate fun facts to appear one by one
    gsap.from(factRefs.current, {
      opacity: 0,
      y: 20,
      duration: 1,
      stagger: 0.3,
    });

    gsap.fromTo(
      leadTextRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 2.5, ease: 'power2.out' }
    );

  }, []);

  const handleSearchClick = () => {
    setHidden(true);
    setTimeout(() => {
      navigate('/chat');
      onSearchClick();
    }, 500); // Adjust timing to match your transition duration
  };
  const containerVariants = {
    initial: {
      opacity: 1,
      transition: {
        duration: 0.5
      },
    },
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.5
      },
    }
  };
  return (
    <motion.div className={`container`} variants={containerVariants} initial="hidden" animate={hidden ? 'hidden' : 'initial'}>
      <header className="jumbotron text-center">
        <p className="display-4">
          TwinChef
        </p>
        <p className="lead" ref={leadTextRef}>
          Unleash Your Inner Chef!
        </p>
      </header>
      <div className="fun-facts-container">
        <p className="did-you-know text-center">Did you know?</p>
        <div className="row">
          {distinctFacts.map((fact, index) => (
            <div key={index} className="col-md-6">
              <div className="fact-box">
                <p ref={(el) => (factRefs.current[index] = el)} className="fun-fact">
                  {fact}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="middle-box text-center">
        <img src={icon} alt="Food Icon" className="food-icon" />
        <p className="lead-1">Ready to Cook?</p>
        <p className="lead-2">
          <p>Enter your ingredients to unlock recipes! Need assistance in any response?</p>
          <p>Click 'Reply' for AI cooking tips and answers.</p>
        </p>
      </div>
      <div className="search-bar">
        <input
          type="text"
          className="form-control"
          placeholder="Enter your Ingredients"
          onClick={handleSearchClick}
        />
      </div>
    </motion.div>
  );
};

export default HomePage;
