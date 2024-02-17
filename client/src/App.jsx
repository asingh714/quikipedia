import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider } from "./utils/AppContext.jsx";

import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AppProvider>
        <Home />
      </AppProvider>
    ),
  },
  {
    path: "/search",
    element: (
      <AppProvider>
        <Search />
      </AppProvider>
    ),
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
