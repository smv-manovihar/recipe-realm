import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Chatbot.css";
import chef from "./images/p4.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faReply,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import greetings from './greetings';
import loadMore from './loadmore';

const Chatbot = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [showDetails, setShowDetails] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [replyTo, setReplyTo] = useState(null);
  const [loadMoreAnimation, setLoadMoreAnimation] = useState(false);

  const [loadMoreKey, setLoadMoreKey] = useState(0);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [llm, setLlm] = useState("GeminiAI");

  useEffect(() => {
    fetch("/ingredients.json")
      .then((response) => response.json())
      .then((data) => {
        setIngredientsList(data);
      })
      .catch((error) => console.error("Error fetching ingredients:", error));
  }, []);



  useEffect(() => {
    // Function to pick a random greeting
    const pickRandomGreeting = () => {
      const randomIndex = Math.floor(Math.random() * greetings.length);
      return greetings[randomIndex];
    };

    // Send a greeting message when the component mounts
    const greetingMessage = pickRandomGreeting();
    const initialMessages = [{ text: greetingMessage, user: false , context: greetingMessage }];
    setMessages(initialMessages);

    // Simulate typing indicator (remove after 1 second)
    const typingTimeout = setTimeout(() => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages];
        updatedMessages[0].typing = false; // Remove typing indicator
        return updatedMessages;
      });
    }, 1000);

    return () => clearTimeout(typingTimeout); // Clean up timeout
  }, []);


  const pickRandomLoadMore = () => {
    const randomIndex = Math.floor(Math.random() * loadMore.length);
    return loadMore[randomIndex]
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    const parts = value.split(",");
    const lastPart = parts[parts.length - 1].trim();

    if (lastPart && !replyTo) {
      // Only show suggestions if not replying
      const filteredSuggestions = ingredientsList.filter((ingredient) =>
        ingredient.toLowerCase().startsWith(lastPart.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const parts = input.split(",");
    parts[parts.length - 1] = suggestion;
    const newInput = parts.join(", ") + ", ";
    setInput(newInput);
    setSelectedIngredients((prev) => [...new Set([...prev, suggestion])]);
    setSuggestions([]);

    inputRef.current.focus();
  };

  const isInputValid = () => {
    const inputIngredients = input
      .split(",")
      .map((item) => item.trim().toLowerCase())
      .filter((item) => item !== ""); // Remove any empty items
    const validIngredients = inputIngredients.every((ingredient) =>
      ingredientsList.map((item) => item.toLowerCase()).includes(ingredient)
    );
    return validIngredients;
  };

  const handleSend = () => {
    if (replyTo) {
      handleReplySend();
    } else {
      handleIngredientSend();
    }
  };

  const handleReplySend = async () => {
    const userMessage = {
      text: input,
      user: true,
      replyTo: replyTo?.text || null,
      recipes: replyTo?.recipes || [], // Include the recipes in the user message
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setSuggestions([]);
    inputRef.current.focus();

    const llm_response = await axios.post(
      "http://localhost:3001/api/generate",
      {
        llm: llm, // Use selected LLM
        context: replyTo.context,
        prompt: userMessage.text,
      }
    );
    const response = llm_response.data.response;

    const botResponse = {
      text: response,
      isReplyResponse: true, // Indicate that this response is for a reply
    };
    console.log(response);
    setMessages((prevMessages) => [...prevMessages, botResponse]);
    triggerLoadMoreAnimation();
  };

  const handleIngredientSend = async () => {
    let inputIngredients = input.trim();
    if (inputIngredients.slice(-2) === ", ") {
      // Remove the trailing ", "
      inputIngredients = inputIngredients.slice(0, -2);
    } else if (inputIngredients.slice(-1) === ",") {
      // Remove the trailing ", "
      inputIngredients = inputIngredients.slice(0, -1);
    }
    const ingredientArray = inputIngredients
      .split(",")
      .map((item) => item.trim());
    if (ingredientArray.length < 3) {
      alert("Please enter at least 3 ingredients.");
      return;
    }

    if (!isInputValid()) {
      alert(
        "Please select the ingredients from suggestions or enter the ingredients that are present in suggestion list"
      );
      return;
    }

    if (inputIngredients.length > 0 && isInputValid()) {
      const userMessage = { text: inputIngredients, user: true, replyTo: null };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setSelectedIngredients([]);
      setInput("");
      setSuggestions([]);
      inputRef.current.focus();

      const result = await axios.post("http://localhost:3001/api/query", {
        //   llm: "llm1",
        llm: llm,
        query: inputIngredients,
      });
      const recipes = result.data.recipes || [];
      const context = result.data.context || "";
      const botResponse = {
        text: `Here are some recipes you can make with ${inputIngredients}:`,
        recipes: recipes,
        context: context,
      };

      setMessages((prevMessages) => [...prevMessages, botResponse]);
      triggerLoadMoreAnimation();
    }
  };

  const handleReplyClick = (msg) => {
    setReplyTo(msg);
    setInput("");
    inputRef.current.focus();
  };

  const handleRecipeClick = (msgIndex, recipeIndex) => {
    const key = `${msgIndex}-${recipeIndex}`;
    setShowDetails((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleLoadMore = async () => {
    try {
      const sllm = llm; // assume selectedLLM is a state variable or prop
      const result = await axios.get("http://localhost:3001/api/loadmore", {
        params: { sllm }
      });
      const text= pickRandomLoadMore();
      const recipes = result.data.recipes;
      const context = result.data.context;
      const botResponse = {
        text: text,
        recipes: recipes,
        context: context,
      };
  
      setMessages((prevMessages) => [...prevMessages, botResponse]);
      triggerLoadMoreAnimation();
    } catch (error) {
      console.error("Error loading more recipes:", error);
    }
  };
  

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const triggerLoadMoreAnimation = () => {
    setLoadMoreAnimation(false);
    setLoadMoreKey((prevKey) => prevKey + 1);
    setTimeout(() => setLoadMoreAnimation(true), 100); // Delay to reapply the animation class
  };

  const handleCancelReply = () => {
    setReplyTo(null);
    setInput("");
    inputRef.current.focus();
  };

  const handleCancelSuggestions = () => {
    setSuggestions([]);
    inputRef.current.focus();
  };

  useEffect(() => {
    if (loadMoreAnimation) {
      const timer = setTimeout(() => setLoadMoreAnimation(false), 500);
      return () => clearTimeout(timer);
    }
  }, [loadMoreAnimation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const hasRecipes = messages.some(
    (msg) => msg.recipes && msg.recipes.length > 0
  );

  const handleToggle = () => {
    setLlm((prevLlm) => (prevLlm === "GeminiAI" ? "Llama" : "GeminiAI"));
  };

  useEffect(() => {
    const switchElement = document.getElementById("s1-57");
    const labelElement = document.querySelector(".wrap-check-57 label");

    const handleToggleLabel = () => {
      labelElement.textContent = llm;
    };

    switchElement.addEventListener("change", handleToggleLabel);

    return () => {
      switchElement.removeEventListener("change", handleToggleLabel);
    };
  }, [llm]);

  return (
    <div className="chatbot-container">
      <header className="chatbot-header">
        <h1 className="display-4">Recipe Realm</h1>
      </header>
      <div className="chatbot-messages">
        {messages.map((msg, msgIndex) => (
          <div
            key={msgIndex}
            className={`message ${msg.user ? "user" : "bot"} ${
              msg.fade ? "fade-in" : ""
            }`}
          >
            <div className="message-box-container">
              {!msg.user && (
                <div
                  className={`chef-image ${msg.typing ? "expand-enter" : ""}`}
                >
                  <img src={chef} alt="Chef" />
                </div>
              )}
              <div
                className={`message-box ${msg.user ? "user-box" : "bot-box"}`}
              >
                {msg.replyTo && (
                  <div className="reply-to">
                    <strong>Replying to:</strong> {msg.replyTo}
                    {msg.user && msg.recipes && (
                      <div className="reply-box-recipes">
                        <strong>Recipes:</strong>{" "}
                        {msg.recipes
                          .map((recipe) => recipe.RecipeName)
                          .join(", ")}
                      </div>
                    )}
                  </div>
                )}
                {msg.typing ? (
                  <div className="typing-indicator">Typing...</div>
                ) : (
                  <>
                    {msg.text}
                    {msg.recipes && !msg.user && (
                      <div className="recipes">
                        {msg.recipes.map((recipe, recipeIndex) => (
                          <div key={recipeIndex} className="recipe">
                            <h5 style={{ fontSize: "1.2em", color: "#030900" }}>
                              {recipe.RecipeName}
                              <FontAwesomeIcon
                                icon={
                                  showDetails[`${msgIndex}-${recipeIndex}`]
                                    ? faChevronUp
                                    : faChevronDown
                                }
                                style={{
                                  marginLeft: "12px",
                                  cursor: "pointer",
                                  fontSize: "0.6em",
                                }}
                                onClick={() =>
                                  handleRecipeClick(msgIndex, recipeIndex)
                                }
                              />
                            </h5>
                            {showDetails[`${msgIndex}-${recipeIndex}`] && (
                              <div className="recipe-details">
                                <div className="recipe-info">
                                  <p>
                                    <strong>Ingredients:</strong>
                                  </p>
                                  <ul>
                                    {recipe.Ingredients.split(",").map(
                                      (ingredient, index) => (
                                        <li key={index}>{ingredient.trim()}</li>
                                      )
                                    )}
                                  </ul>
                                  <p>
                                    <strong>Instructions:</strong>
                                  </p>
                                  <p>{recipe.Instructions}</p>
                                  <p>
                                    <strong>Cuisine:</strong> {recipe.Cuisine}
                                  </p>
                                  <p>
                                    <strong>Course:</strong> {recipe.Course}
                                  </p>
                                  <p>
                                    <strong>Diet:</strong> {recipe.Diet}
                                  </p>
                                  <p>
                                    <strong>Servings:</strong> {recipe.Servings}
                                  </p>
                                  <p>
                                    <strong>Prep Time:</strong>{" "}
                                    {recipe.PrepTimeInMins} mins
                                  </p>
                                  <p>
                                    <strong>Cook Time:</strong>{" "}
                                    {recipe.CookTimeInMins} mins
                                  </p>
                                  <p>
                                    <strong>Total Time:</strong>{" "}
                                    {recipe.TotalTimeInMins} mins
                                  </p>
                                </div>
                                <div className="recipe-image">
                                  <img
                                    src={recipe["image-url"]}
                                    alt={recipe.RecipeName}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
              {!msg.user && !msg.typing && !msg.isReplyResponse && (
                <div className="reply-button-container">
                  <button
                    className="btn btn rounded-circle custom-reply-button"
                    onClick={() => handleReplyClick(msg)}
                  >
                    <FontAwesomeIcon
                      icon={faReply}
                      style={{
                        color: "#030904",
                        transform: "translateY(-75px)",
                        fontSize: "19px",
                      }}
                    />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
        <div className="load-more-container">
          {hasRecipes && (
            <button
              key={loadMoreKey} // Use unique key to force re-render
              className={`btn btn-secondary load-more-button ${
                loadMoreAnimation ? "expand" : ""
              }`}
              onClick={handleLoadMore}
            >
              Load More
            </button>
          )}
        </div>
      </div>
      <div className="chatbot-input-container">
        {replyTo && (
          <div className="reply-box">
            <div className="reply-box-text">
              <strong>Replying to:</strong> {replyTo.text}
              {replyTo.recipes && (
                <div className="reply-box-recipes">
                  <strong>Recipes:</strong>{" "}
                  {replyTo.recipes
                    .map((recipe) => recipe.RecipeName)
                    .join(", ")}
                </div>
              )}
            </div>
            <div className="reply-box-cancel" onClick={handleCancelReply}>
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
        )}

        {suggestions.length > 0 && !replyTo && (
          <div className="suggestions-box">
            <div className="suggestions-header">
              <strong>Suggestions:</strong>
              <div
                className="suggestions-cancel"
                onClick={handleCancelSuggestions}
              >
                <FontAwesomeIcon icon={faTimes} />
              </div>
            </div>
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                className="suggestion"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion}
              </div>
            ))}
          </div>
        )}

        {/* <select
            value={selectedLLM}
            onChange={(e) => setSelectedLLM(e.target.value)}
            className="form-control llm-select"
        >
            <option value="GeminAI">GeminAI</option>
            <option value="Cohere">Cohere</option>
        </select> */}

        <div className="wrap-check-57">
          <input
            id="s1-57"
            type="checkbox"
            className="switch"
            checked={llm === "GeminiAI"}
            onChange={handleToggle}
          />
          <label htmlFor="s1-57">{llm}</label>
        </div>

        <div className="chatbot-input">
          <input
            ref={inputRef}
            type="text"
            className="form-control"
            placeholder={
              replyTo
                ? "Feel free to ask your queries..."
                : "What do you have in your hands to cook...?"
            }
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className="btn btn-primary" onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;













