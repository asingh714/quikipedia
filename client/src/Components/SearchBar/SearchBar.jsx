import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./SearchBar.css";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "../../assets/search.svg";
import newRequest from "../../utils/newRequest";
import { useAppContext } from "../../utils/AppContext";

const SearchBar = ({ handleSearch }) => {
  const {
    setSearchTerm,
    mode,
    setMode,
    setIsRandom,
    suggestions,
    setSuggestions,
    inputValue,
    setInputValue,
  } = useAppContext();
  const [isInputFocused, setIsInputFocused] = useState(false);
  const suggestionsRef = useRef(null);
  const navigate = useNavigate();
  const [focusedSuggestionIndex, setFocusedSuggestionIndex] = useState(-1);
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

  useEffect(() => {
    setFocusedSuggestionIndex(-1);
  }, [suggestions]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "normal" ? "fun" : "normal"));
  };

  // const handleSubmitSearch = () => {
  //   setSearchTerm(inputValue);
  //   setIsRandom(false);
  //   setSuggestions([]);
  //   navigate("/search");
  // };

  const handleInputFocus = () => {
    setIsInputFocused(true);
  };

  // const handleInputBlur = () => {
  //   setIsInputFocused(false);
  // };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    } else if (e.key === "Tab" && suggestions.length > 0) {
      e.preventDefault();
      const nextIndex = (focusedSuggestionIndex + 1) % suggestions.length;
      setFocusedSuggestionIndex(nextIndex);
      setInputValue(suggestions[nextIndex]);
    } else if (e.key === "Escape") {
      setSuggestions([]);
    }
  };

  const handleSelectedSearch = (suggestion) => {
    setIsRandom(false);
    setInputValue(suggestion);
    setSearchTerm(suggestion);
    navigate("/search");
    setSuggestions([]);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="main-input"
        value={inputValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        // onBlur={handleInputBlur}
        onKeyDown={handleKeyPress}
      />
      {suggestions.length > 0 && (
        <ul className="suggestions-list" ref={suggestionsRef}>
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className={`suggestion-item ${
                index === focusedSuggestionIndex
                  ? "suggestion-item-focused"
                  : ""
              }`}
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

SearchBar.propTypes = {
  handleSearch: PropTypes.func.isRequired,
};
export default SearchBar;
