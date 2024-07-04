// src/components/HomePage.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './HomePage.css';
import pineapple from './images/pineapple.jpg';
import carrots from './images/carrots.jpg';
import cake from './images/cake.jpg';
import cheese from './images/cheese.jpg';                     

const HomePage = ({ onSearchClick }) => {       
  return (
    <div className="container">
      <header className="jumbotron text-center">
        <h1 className="display-4">RECIPE REALM</h1>
        <p className="lead">Chop it like it's hot!</p>
      </header>
      <div className="row">
        <div className="col-md-6">
          <img src={pineapple} className="img-fluid custom-img" alt="Recipe 1" />
          <p className="fun-fact">Pineapples: the only fruit that wears a crown and dares you to touch its spiky throne!</p>
        </div>
        <div className="col-md-6">
          <img src={carrots} className="img-fluid custom-img" alt="Recipe 2" />
          <p className="fun-fact">Carrots were originally purple until they got embarrassed and turned orange.</p>
        </div>
        <div className="col-md-6">
          <img src={cake} className="img-fluid custom-img" alt="Recipe 1" />
          <p className="fun-fact">Cake:The only reason to believe that cutting something can make you happier.</p>
        </div>
        <div className="col-md-6">
          <img src={cheese} className="img-fluid custom-img" alt="Recipe 2" />
          <p className="fun-fact">Cheese is like a good friend-it's always there to melt your heart!.</p>
        </div>
        {/* Add more images and fun facts in a criss-cross pattern */}
      </div>
      <div className="search-bar">
        <input type="text" className="form-control" placeholder="Enter your ingredients" onClick={onSearchClick} />
      </div>
    </div>
  );
};

export default HomePage;
