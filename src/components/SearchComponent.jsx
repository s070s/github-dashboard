import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api/github";
import { toast } from "react-toastify";

function SearchComponent() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim()) {
      toast.error("Please enter a username");
      return;
    }

    const trimmedUsername = username.trim();
    if (!trimmedUsername) return;
    setIsLoading(true);
    fetchUserProfile(trimmedUsername)
      .then((response) => {
        if (response.status === 200) {
          navigate(`/?user=${encodeURIComponent(trimmedUsername)}`, {
            state: { userData: response.data },
          });
        } else {
          toast.error("User not found");
        }
      })
      .catch(() => {
        toast.error("Error fetching user profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Github username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
export default SearchComponent;
