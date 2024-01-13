import "./Home.css";

const Home = () => {
  return (
    <main>
      <header>
        <h1>Quikipedia</h1>
        <p>Wikipedia summaries for those in a hurry</p>
      </header>
      <form>
        <input type="text" className="main-input"/>
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
