import { useNavigate } from "react-router-dom";

import SearchBar from "../../Components/SearchBar/SearchBar";
import { useAppContext } from "../../utils/AppContext";
import "./Home.css";

// The Home component serves as the landing page for Quikipedia.
// It displays the search bar and buttons to search or get a random article.
const Home = () => {
  const { handleSearch, handleRandomSearch } = useAppContext();
  const navigate = useNavigate();

  // handleSubmit is called when the user submits a search term.
  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch();
    navigate("/search");
  };

  // handleRandomSubmit is called when the user wants a random article.
  const handleRandomSubmit = (e) => {
    e.preventDefault();
    handleRandomSearch();
    navigate("/search");
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
        <p>Quick AI-Generated Wikipedia summaries</p>
      </header>
      <form onSubmit={handleSubmit}>
        <SearchBar />
        <div className="button-container">
          <button className="search-btn" onClick={handleSubmit}>
            Search
          </button>
          <button className="random-btn" onClick={handleRandomSubmit}>
            Something random 🤪
          </button>
        </div>
      </form>
    </main>
  );
};

export default Home;
