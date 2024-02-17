import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [mode, setMode] = useState("normal");
  const [isRandom, setIsRandom] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(searchTerm);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setIsRandom(false);
    setSearchTerm(inputValue);
    navigate("/search");
  };

  const handleRandomSearch = (e) => {
    e.preventDefault();
    setIsRandom(true);
    setSearchTerm("");
    navigate("/search");
  };

  return (
    <AppContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        mode,
        setMode,
        isRandom,
        setIsRandom,
        suggestions,
        setSuggestions,
        inputValue,
        setInputValue,
        handleSearch,
        handleRandomSearch,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
