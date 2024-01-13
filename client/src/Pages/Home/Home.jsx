import "./Home.css";
import Search from "../../assets/search.svg";

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
        <p>Wikipedia summaries for those in a hurry</p>
      </header>
      <form>
        <input type="text" className="main-input" />
        <img src={Search} alt="" />
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
