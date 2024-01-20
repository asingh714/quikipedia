import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Home from "./Pages/Home/Home";
import Search from "./Pages/Search/Search";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/search",
    element: <Search />,
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

/* 
TODO: 

Home Page: 
- click list item and goes to search page 
- type into search and goes to search page 
- type into random and goes to search page 

Search page: 
- Full design  
- Search Bar Component 

MISC: 
- Loaders 
- Responsive 
- Compliance 
*/
