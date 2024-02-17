import SearchBar from "../../Components/SearchBar/SearchBar";
import { useAppContext } from "../../utils/AppContext";
import "./Home.css";

const Home = () => {
  const { handleSearch, handleRandomSearch } = useAppContext();

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
      <form onSubmit={handleSearch}>
        <SearchBar />
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
