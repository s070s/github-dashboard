import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SearchComponent() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }
    setError(null);
    navigate(`/?user=${encodeURIComponent(username.trim())}`);
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
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </div>
      {error && <div className="text-danger mt-2">{error}</div>}
    </form>
  );
}
export default SearchComponent;
