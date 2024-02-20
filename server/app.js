import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import morgan from "morgan";
import OpenAI from "openai";
import {
  fetchWikiSearchResults,
  fetchSuggestions,
  fetchWikiExtract,
  fetchRandomWikiPage,
  formatSearchTerm,
} from "./utils.js";

const app = express();

// CORS configuration for Development
// app.use(cors({ origin: "http://localhost:5173", credentials: true }));

// CORS configuration to enable cross-origin requests from specified origins
app.use(
  cors((req, callback) => {
    const allowedOrigins = [
      "https://quikipedia-client.onrender.com",
      "https://quikipedia-client.onrender.com/",
      "https://www.quikipedia.com",
      "https://www.quikipedia.com/",
      "https://quikipedia.com",
      "https://quikipedia.com/",
    ];
    const origin = req.header("Origin");
    let corsOptions;
    if (allowedOrigins.includes(origin)) {
      corsOptions = { origin: true, credentials: true };
    } else {
      corsOptions = { origin: false };
    }
    callback(null, corsOptions);
  })
);

app.use(morgan("tiny"));
app.use(express.json());

// Initialize OpenAI with the API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Endpoint to summarize a given topic or fetch a random Wikipedia page
app.get("/summarize", async (req, res) => {
  const { searchTerm, mode, isRandom } = req.query;
  console.log(searchTerm, mode, isRandom);

  let wikiResponse;
  try {
    if (isRandom === "true") {
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
          : `It seems there isn't a Wikipedia page on this topic. Can you research and provide a summary about "${searchTerm}" in a way that is informative and concise? Keep it under 350 characters.`;

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

// Endpoint to retrieve all search results for a given query from Wikipedia
app.get("/allResults", async (req, res) => {
  const { searchTerm } = req.query;

  try {
    const searchResults = await fetchWikiSearchResults(searchTerm);
    res.status(200).json({ searchResults });
  } catch (error) {
    res.status(500).send("Error generating Wiki Summary");
  }
});

// Endpoint to fetch search suggestions based on user input
app.get("/allSuggestions", async (req, res) => {
  res.set("Cache-Control", "no-store");
  const { searchTerm } = req.query;
  try {
    const suggestions = await fetchSuggestions(searchTerm);
    res.status(200).json({ suggestions });
  } catch (error) {
    res.status(500).send("Error generating Wiki Summary");
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
