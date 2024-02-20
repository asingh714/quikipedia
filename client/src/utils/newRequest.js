import axios from "axios";

// This instance will be used for all HTTP requests in the app to maintain consistency and reusability
const newRequest = axios.create({
  // baseURL: "http://localhost:3000", // Development baseURL
  baseURL: "https://quikipedia.onrender.com",
  withCredentials: true,
});

export default newRequest;
