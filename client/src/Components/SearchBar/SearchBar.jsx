import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./SearchBar.css";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "../../assets/search.svg";
import newRequest from "../../utils/newRequest";
import { useAppContext } from "../../utils/AppContext";

const SearchBar = () => {
  const {
    searchTerm,
    setSearchTerm,
    mode,
    setMode,
    setIsRandom,
    suggestions,
    setSuggestions,
  } = useAppContext();
  const [inputValue, setInputValue] = useState(searchTerm);
  const [isInputFocused, setIsInputFocused] = useState(false);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();

  const debouncedSearchTerm = useDebounce(inputValue, 500);

  useEffect(() => {
    if (debouncedSearchTerm && isInputFocused) {
      const fetchSuggestions = async () => {
        try {
          const response = await newRequest.get("/allSuggestions", {
            params: {
              searchTerm: debouncedSearchTerm,
            },
          });
          setSuggestions(response.data.suggestions);
        } catch (error) {
          console.error("Error fetching search suggestions:", error);
        }
      };

      fetchSuggestions();
    } else {
      setSuggestions([]);
    }
  }, [debouncedSearchTerm, isInputFocused, setSuggestions]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setSuggestions]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "normal" ? "fun" : "normal"));
  };

  const handleSubmitSearch = () => {
    setSearchTerm(inputValue);
    setIsRandom(false);
    setSuggestions([]);

    navigate("/search");
  };
  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  const handleInputBlur = () => {
    setIsInputFocused(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmitSearch();
    }
  };

  const handleSelectedSearch = (suggestion) => {
    setIsRandom(false);
    setInputValue(suggestion);
    setSearchTerm(suggestion);
    setSuggestions([]);
    navigate("/search");
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="main-input"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleKeyPress}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleSelectedSearch(suggestion)}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      <img src={SearchIcon} alt="Search" className="search-icon" />
      <label className="switch">
        <input type="checkbox" onChange={toggleMode} checked={mode === "fun"} />
        <span className="slider round"></span>
      </label>
      <span className="fun-mode-label">Fun Mode</span>
    </div>
  );
};

export default SearchBar;
