// Function to fetch search results from Wikipedia based on a search term
const fetchWikiSearchResults = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${searchTerm}&gsrlimit=20&prop=pageimages|extracts&exchars=20&exintro&explaintext&exlimit=max&format=json&origin=*`
    );
    const data = await response.json();
    return data.query ? Object.values(data.query.pages) : [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

// Function to fetch search suggestions from Wikipedia as the user types
const fetchSuggestions = async (searchTerm) => {
  const url = `https://en.wikipedia.org/w/api.php?action=opensearch&search=${searchTerm}&limit=10&namespace=0&format=json&origin=*`;

  try {
    const response = await fetch(url);
    const suggestions = await response.json();
    return suggestions[1];
  } catch (error) {
    console.error("Error fetching search suggestions:", error);
  }
};

// Function to fetch a page extract and image URL from Wikipedia
const fetchWikiExtract = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro&explaintext&titles=${searchTerm}&pithumbsize=500`
    );
    const data = await response.json();
    const page = Object.values(data.query.pages)[0];
    if (page.missing !== undefined) {
      return { extract: null, imageUrl: null, isMissing: true };
    }

    const extract = page.extract;
    const imageUrl = page.thumbnail ? page.thumbnail.source : null;
    return { extract, imageUrl, isMissing: false };
  } catch (error) {
    return error;
  }
};

// Function to fetch a random Wikipedia page's extract and image URL
const fetchRandomWikiPage = async () => {
  try {
    const randomPageResponse = await fetch(
      "https://en.wikipedia.org/w/api.php?action=query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*"
    );
    const randomData = await randomPageResponse.json();
    const randomPageTitle = randomData.query.random[0].title;

    const extractResponse = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(
        randomPageTitle
      )}&pithumbsize=500&origin=*`
    );
    const extractData = await extractResponse.json();
    const page = Object.values(extractData.query.pages)[0];

    if (page.missing !== undefined) {
      return { extract: null, imageUrl: null, isMissing: true };
    }

    const extract = page.extract;
    const imageUrl = page.thumbnail ? page.thumbnail.source : null;

    return { extract, imageUrl, isMissing: false };
  } catch (error) {
    console.error(error);
    return { error: error.message };
  }
};

// Utility function to format search terms into Wikipedia page title format
const formatSearchTerm = (searchTerm) => {
  return searchTerm
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("_");
};

export {
  fetchWikiSearchResults,
  fetchSuggestions,
  fetchWikiExtract,
  fetchRandomWikiPage,
  formatSearchTerm,
};
