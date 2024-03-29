import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

// Create a context for the app to provide global state
const AppContext = createContext();

// Custom hook to use the app context
export const useAppContext = () => useContext(AppContext);

//// AppProvider component that wraps children components to provide them with the context's value.
export const AppProvider = ({ children }) => {
  const [mode, setMode] = useState("normal");
  const [isRandom, setIsRandom] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [inputValue, setInputValue] = useState(searchTerm);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    setIsRandom(false);
    setSearchTerm(inputValue);
  };

  const handleRandomSearch = () => {
    setIsRandom(true);
    setSearchTerm("");
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
