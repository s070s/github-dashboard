import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SearchComponent from "./components/SearchComponent";
import ProfilePage from "./pages/ProfilePage";
import RepositoriesPage from "./pages/RepositoriesPage";
import FollowersPage from "./pages/FollowersPage";

function App() {
  return (
    <BrowserRouter>
      <div className="container mt-4">
        <SearchComponent />
        <Routes>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/repos" element={<RepositoriesPage />} />
          <Route path="/followers" element={<FollowersPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
