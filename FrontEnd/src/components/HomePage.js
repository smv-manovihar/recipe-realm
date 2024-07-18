



import React, { useEffect, useRef, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import icon from './images/chef.png';
//import chef from './images/foodicon.jpg';
import funFacts from './funfacts';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';

const HomePage = ({ onSearchClick }) => {
  const chefIconRef = useRef(null);
  const factRefs = useRef([]);
  const leadTextRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const navigate = useNavigate();

  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  const getDistinctFacts = (count) => {
    const shuffledFacts = shuffleArray(funFacts);
    return shuffledFacts.slice(0, count);
  };

  const distinctFacts = getDistinctFacts(4); // Get 4 distinct facts

  useEffect(() => {
    // Rotating animation for the chef icon
    gsap.to(chefIconRef.current, {
      rotation: 360,
      duration: 5,
      repeat: -1,
      ease: 'linear',
    });

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

  return (
    <div className={`container ${hidden ? 'hidden' : ''}`}>
      <header className="jumbotron text-center">
        <p className="display-4">
          {/* <img
            ref={chefIconRef}
            src={chef}
            alt="Food Chef"
            className="icon-chef"
          /> */}
          RECIPE REALM
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
        Enter your ingredients to unlock recipes! Need assistance in any response? Click 'Reply' for AI cooking tips and answers.
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
    </div>
  );
};

export default HomePage;
