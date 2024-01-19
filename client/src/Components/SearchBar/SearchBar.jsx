import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "./SearchBar.css";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "../../assets/search.svg";
import newRequest from "../../utils/newRequest";
import { useAppContext } from "../../utils/AppContext";

const SearchBar = () => {
  const { searchTerm, setSearchTerm, mode, setMode, setIsRandom } =
    useAppContext();
  const suggestionsRef = useRef(null);
  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const navigate = useNavigate();

  useEffect(() => {
    if (debouncedSearchTerm) {
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
  }, [debouncedSearchTerm]);

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
  }, []);

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "normal" ? "fun" : "normal"));
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSelectedSearch = (suggestion) => {
    setIsRandom(false);
    setSearchTerm(suggestion);
    navigate("/search");
  };
  return (
    <div className="search-container">
      <input
        type="text"
        className="main-input"
        value={searchTerm}
        onChange={handleInputChange}
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
