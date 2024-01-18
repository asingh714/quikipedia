import { useQuery } from "@tanstack/react-query";

import newRequest from "../../utils/newRequest";
import { useAppContext } from "../../utils/AppContext";
import "./Search.css";

const Search = () => {
  const { searchTerm, mode, isRandom } = useAppContext();

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
    <div className="search-result">
      {data?.data?.summary && <p>{data.data.summary}</p>}
      {data?.data?.imageUrl && <img src={data.data.imageUrl} alt="Summary" />}
    </div>
  );
};

export default Search;
