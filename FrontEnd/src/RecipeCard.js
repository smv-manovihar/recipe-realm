// src/RecipeCard.js

import React from 'react';
import './RecipeCard.css';

function RecipeCard({ recipe }) {
    return (
        <div className="recipe-card">
            <h3>{recipe.RecipeName}</h3>
            <p><strong>Ingredients:</strong> {recipe.Ingredients}</p>
            <p><strong>Instructions:</strong> {recipe.Instructions}</p>
            <p><strong>Diet:</strong> {recipe.Diet}</p>
            <p><strong>Course:</strong> {recipe.Course}</p>
            <p><strong>Servings:</strong> {recipe.Servings}</p>
            <p><strong>Prep Time:</strong> {recipe.PrepTimeInMins} mins</p>
            <p><strong>Cook Time:</strong> {recipe.CookTimeInMins} mins</p>
            <p><strong>Total Time:</strong> {recipe.TotalTimeInMins} mins</p>
        </div>
    );
}

export default RecipeCard;
