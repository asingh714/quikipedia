import axios from "axios";

const newRequest = axios.create({
  // baseURL: "http://localhost:3000",
  baseURL: "https://quikipedia.onrender.com",
  withCredentials: true,
});

export default newRequest;
