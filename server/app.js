import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.get("/", (req, res) => {
  res.send({ msg: "Hello World!" });
});
// https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=google_search&gsrlimit=20&prop=pageimages|extracts&exchars=20&exintro&explaintext&exlimit=max&format=json&origin=*
// https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&pageids=12431
// https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${searchTerm}
// https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=Jordan_Belfort
// https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=Google

// `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${searchTerm}`

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

const fetchRandomWikiPage = async () => {
  try {
    // Fetch a random page
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

const formatSearchTerm = (searchTerm) => {
  return searchTerm
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("_");
};

app.get("/summarize", async (req, res) => {
  const { searchTerm, mode, isRandom } = req.body;
  let wikiResponse;
  try {
    if (isRandom) {
      wikiResponse = await fetchRandomWikiPage();
    } else {
      const formattedSearchTerm = formatSearchTerm(searchTerm);
      wikiResponse = await fetchWikiExtract(formattedSearchTerm);
    }

    const { extract, imageUrl, isMissing } = wikiResponse;
    let messages = [];

    if (isMissing) {
      const researchPrompt =
        mode === "fun"
          ? ` Alright, let's make learning fun! Can you summarize the following text in a way that's easy-going, a bit silly, and still informative? Keep it under 350 characters and feel free to add a dash of humor or some quirky facts you might know!  Can you humorously research and provide a fun summary about "${searchTerm}"? Keep it short and snazzy, under 350 characters please! 🌟`
          : `It seems there isn't a Wikipedia page on this topic. Can you research and provide a summary about "${searchTerm}" in a way that's easy-going, a bit silly, and still informative? Keep it under 350 characters.`;

      messages = [{ role: "system", content: researchPrompt }];
    } else if (mode === "fun") {
      messages = [
        {
          role: "system",
          content:
            "Alright, let's make learning fun! Can you summarize the following text in a way that's easy-going, a bit silly, and still informative? Keep it under 350 characters and feel free to add a dash of humor or some quirky facts you might know!",
        },
        {
          role: "user",
          content: `${extract}`,
        },
      ];
    } else {
      messages = [
        {
          role: "system",
          content:
            "Please provide a concise summary of the following text, highlighting the key points and main themes. The summary should not exceed 350 characters. Feel free to include any relevant additional information you might be aware of that is not mentioned in the text",
        },
        {
          role: "user",
          content: `${extract}`,
        },
      ];
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
    });
    res
      .status(200)
      .json({ summary: completion.choices[0].message.content, imageUrl });
  } catch (error) {
    res.status(500).send("Error generating Wiki Summary");
  }
});

app.get("/allResults", async (req, res) => {
  const { searchTerm, mode } = req.body;
  try {
    const searchResults = await fetchWikiSearchResults(searchTerm);
    res.status(200).json({ searchResults });
  } catch (error) {
    res.status(500).send("Error generating Wiki Summary");
  }
});

app.get("/allSuggestions", async (req, res) => {
  const { searchTerm } = req.body;
  try {
    const suggestions = await fetchSuggestions(searchTerm);
    res.status(200).json({ suggestions });
  } catch (error) {
    res.status(500).send("Error generating Wiki Summary");
  }
});

// Endpoint to get a random Wikipedia summary
// app.get("/randomSummary", async (req, res) => {
//   try {
//     const randomPage = await fetchRandomWikiPage();
//     if (randomPage.error) {
//       res.status(500).send("Error fetching a random Wikipedia summary");
//     } else {
//       res.status(200).json(randomPage);
//     }
//   } catch (error) {
//     res.status(500).send("Server Error");
//   }
// });

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
