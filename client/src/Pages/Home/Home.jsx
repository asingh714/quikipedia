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
          <label className="switch">
            <input type="checkbox" />
            <span className="slider round"></span>
          </label>
          <span className="fun-mode-label">Fun Mode</span>
        </div>
        <div className="button-container">
          <button className="search-btn">Search</button>
          <button className="random-btn">Something random 🤪</button>
        </div>
      </form>
    </main>
  );
};

export default Home;
