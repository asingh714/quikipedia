import { useQuery } from "@tanstack/react-query";

import newRequest from "../../utils/newRequest";
import { useAppContext } from "../../utils/AppContext";
import SearchBar from "../../Components/SearchBar/SearchBar";
import SearchIcon from "../../assets/question.svg";
import "./Search.css";

const Search = () => {
  const { searchTerm, mode, isRandom } = useAppContext();
  console.log("searchTerm", searchTerm);
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
    return <div>Loading...</div>;
  }

  if (isError) {
    console.error("Error fetching data:", error);
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="search-page-container">
      <nav className="nav-container">
        <img src={SearchIcon} alt="" />
        <SearchBar />
      </nav>
      <div className="search-result">
        {data?.data?.imageUrl && <img src={data.data.imageUrl} alt="Summary" />}
        {data?.data?.summary && <p>{data.data.summary}</p>}
      </div>
    </div>
  );
};

export default Search;
