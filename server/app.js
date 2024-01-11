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

const fetchWikiExtract = async (searchTerm) => {
  try {
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&exintro&explaintext&titles=${searchTerm}`
    );
    const data = await response.json();
    const page = Object.values(data.query.pages)[0];
    const extract = page.extract;

    return extract;
  } catch (error) {
    return error;
  }
};

app.get("/summarize", async (req, res) => {
  const { searchTerm } = req.body;

  try {
    const extract = await fetchWikiExtract(searchTerm);

    const messages = [
      {
        role: "system",
        content:
          "Please provide a concise summary of the following text, highlighting the key points and main themes. The summary should not exceed 500 characters. Feel free to include any relevant additional information you might be aware of that is not mentioned in the text",
      },
      {
        role: "user",
        content: `${extract}`,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
    });
    res.status(200).json(completion.choices[0].message.content);
  } catch (error) {
    res.status(500).send("Error generating Wiki Summary");
  }
});

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
