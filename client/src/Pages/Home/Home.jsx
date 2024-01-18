import { useState, useEffect } from "react";

import newRequest from "../../utils/newRequest";
import { useAppContext } from "../../utils/AppContext";
import { useDebounce } from "../../hooks/useDebounce";
import SearchIcon from "../../assets/search.svg";
import "./Home.css";

const Home = () => {
  const { searchTerm, setSearchTerm, mode, setMode, isRandom, setIsRandom } =
    useAppContext();

  const [suggestions, setSuggestions] = useState([]);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

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

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === "normal" ? "fun" : "normal"));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setIsRandom(false);
    console.log(`Searching for: ${searchTerm} in ${mode} mode.`);
  };

  const handleRandomSearch = (e) => {
    e.preventDefault();
    setIsRandom(true);
    console.log(
      `Fetching something random in ${mode} mode. And isRandom is setTo ${isRandom}`
    );
  };

  return (
    <main className="main-container">
      <div className="bg-container">
        <div className="bg-shape bg-shape1"></div>
        <div className="bg-shape bg-shape2"></div>
        <div className="bg-shape bg-shape3"></div>
      </div>
      <header>
        <h1>Quikipedia</h1>
        <p>Quick Wikipedia summaries for those in a hurry</p>
      </header>
      <form>
        <div className="search-container">
          <input
            type="text"
            className="main-input"
            value={searchTerm}
            onChange={handleInputChange}
          />
          {suggestions.length > 0 && (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  // onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
          <img src={SearchIcon} alt="Search" className="search-icon" />
          <label className="switch">
            <input
              type="checkbox"
              onChange={toggleMode}
              checked={mode === "fun"}
            />
            <span className="slider round"></span>
          </label>
          <span className="fun-mode-label">Fun Mode</span>
        </div>

        <div className="button-container">
          <button className="search-btn" onClick={handleSearch}>
            Search
          </button>
          <button className="random-btn" onClick={handleRandomSearch}>
            Something random 🤪
          </button>
        </div>
      </form>
    </main>
  );
};

export default Home;
