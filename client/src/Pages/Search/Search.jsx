import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import newRequest from "../../utils/newRequest";
import { useAppContext } from "../../utils/AppContext";
import SearchBar from "../../Components/SearchBar/SearchBar";
import SearchIcon from "../../assets/question.svg";
import Spinner from "../../Components/Spinner/Spinner";
import "./Search.css";

// The Search component displays the results of a search query
const Search = () => {
  const { searchTerm, mode, isRandom } = useAppContext();

  // useQuery hook from react-query to fetch data when component mounts or updates
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["summary", searchTerm, mode, isRandom],
    queryFn: () =>
      newRequest.get("/summarize", {
        params: { searchTerm, mode, isRandom },
      }),
    enabled: !!searchTerm || isRandom,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return (
      <div className="loading-page-container">
        <Spinner />
      </div>
    );
  }

  if (isError) {
    console.error("Error fetching data:", error);
    return <div className="loading-page-container">Error: {error.message}</div>;
  }

  return (
    <div className="search-page-container">
      <nav className="nav-container">
        <Link to="/">
          <img src={SearchIcon} alt="" />
        </Link>
        <SearchBar />
      </nav>
      <div className="search-result-container">
        {data?.data?.imageUrl && <img src={data.data.imageUrl} alt="Summary" />}
        {data?.data?.summary && <p>{data.data.summary}</p>}
      </div>
    </div>
  );
};

export default Search;
