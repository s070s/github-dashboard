import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchUserRepositories } from "../api/github";
import { toast } from "react-toastify";

function RepositoriesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("user");

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    fetchUserRepositories(username)
      .then((response) => {
        setRepos(response.data);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error getting user repositories");
        setRepos([]);
        setLoading(false);
      });
  }, [username]);

  if (!username) {
    return <p>No user selected</p>;
  }

  if (loading) {
    return <p>Loading repositories...</p>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center mb-5">
            <h2 className="display-6 mb-3">Repositories</h2>
            <h3 className="h4 text-primary mb-4">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="text-decoration-none hover-shadow"
              >
                {username}
              </a>
            </h3>

            <button
              className="btn btn-outline-secondary start-over-btn"
              onClick={() => navigate(`/?user=${username}`)}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Start Over
            </button>
          </div>

          <div className="card shadow-sm">
            <div className="list-group list-group-flush">
              {repos.map((repo) => (
                <div
                  key={repo.id}
                  className="list-group-item list-group-item-action p-4 hover-bg-light"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-1">
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-decoration-none text-dark"
                      >
                        {repo.name}
                      </a>
                    </h5>
                    <span className="badge bg-warning text-dark rounded-pill">
                      <i className="fas fa-star me-1"></i>
                      {repo.stargazers_count}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="text-muted mb-0 small mt-2">
                      {repo.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Empty State */}
          {repos.length === 0 && !loading && (
            <div className="text-center mt-5">
              <i className="fas fa-code-branch fa-3x text-muted mb-3"></i>
              <p className="text-muted">This user has no repositories yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RepositoriesPage;
