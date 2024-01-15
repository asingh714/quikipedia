import "./Home.css";
import SearchIcon from "../../assets/search.svg";

const Home = () => {
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
          <input type="text" className="main-input" placeholder="" />
          <img src={SearchIcon} alt="Search" className="search-icon" />
        </div>
        <div>
          <label htmlFor="funModeSwitch" className="switch-label">
            Fun Mode
          </label>
          <div className="switch">
            <input type="checkbox" id="funModeSwitch" />
            <span className="slider"></span>
          </div>
        </div>
        <div className="button-container">
          <button>Search</button>
          <button>Something random 🤪</button>
        </div>
      </form>
    </main>
  );
};

export default Home;
