import { createContext, useState, useContext } from "react";
import PropTypes from "prop-types";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("normal");
  const [isRandom, setIsRandom] = useState(false);

  return (
    <AppContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        mode,
        setMode,
        isRandom,
        setIsRandom,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
