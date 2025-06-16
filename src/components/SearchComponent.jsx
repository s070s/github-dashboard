import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchUserProfile } from "../api/github";
import { toast } from "react-toastify";

function SearchComponent() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Do not reload the page

    // Validation for empty username
    const trimmedUsername = username.trim();
    if (!trimmedUsername) {
      toast.error("Please enter a username");
      return;
    }
    setIsLoading(true);

    // Call to the API
    fetchUserProfile(trimmedUsername)
      .then((response) => {
        //If successful(200), navigate to the user profile page
        if (response.status === 200) {
          navigate(`/?user=${encodeURIComponent(trimmedUsername)}`, {
            state: { userData: response.data },
          });
        } else {
          toast.error("User not found");
        }
      })
      .catch(() => {
        // Error if API call fails
        toast.error("Error fetching user profile");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <form className="mb-4" onSubmit={handleSubmit}>
      {/* Username input field */}
      <div className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Github username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        {/* Submit button*/}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
    </form>
  );
}
export default SearchComponent;
