import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchUserRepositories } from "../api/github";

function RepositoriesPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("user");

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    setError(null);

    fetchUserRepositories(username)
      .then((response) => {
        setRepos(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching repositories.");
        setRepos([]);
        setLoading(false);
      });
  }, [username]);

  //stargazers_count is a Github API field that indicates the no of stars of a repository
  const sortedRepos = [...repos].sort((a, b) => {
    return sortOrder === "asc"
      ? a.stargazers_count - b.stargazers_count
      : b.stargazers_count - a.stargazers_count;
  });

  if (!username) {
    return <p>No user selected</p>;
  }

  if (loading) {
    return <p>Loading repositories...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  return (
    <div className="repositories-page">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div className="d-flex align-items-center">
          <h2 className="mb-0 me-2">Repositories of</h2>
          <h2 className="username-title mb-0">
            <a
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noreferrer"
              className="text-decoration-none text-dark repo-title"
            >
              {username}
            </a>
          </h2>
        </div>

        <div
          className="text-primary"
          style={{ cursor: "pointer" }}
          onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
        >
          <i
            className={`fas fa-sort-amount-${
              sortOrder === "asc" ? "up" : "down"
            }`}
          ></i>
          <span className="ms-2">
            Sort by Stars: {sortOrder === "asc" ? "Ascending" : "Descending"}
          </span>
        </div>
      </div>

      <div className="list-group">
        {sortedRepos.map((repo) => (
          <div key={repo.id} className="list-group-item">
            <h5>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none text-dark repo-title"
              >
                {repo.name}
              </a>
            </h5>
            <p className="text-muted mb-1">{repo.description}</p>
            <small>⭐ {repo.stargazers_count} stars</small>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RepositoriesPage;
