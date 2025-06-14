import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetchUserRepositories } from "../api/github";
import { toast } from "react-toastify";
import { getPageRange, calculatePagination } from "../utilities/pagination";

function RepositoriesPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("user");

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  const [sortDirection, setSortDirection] = useState("desc");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  {
    /* Client Side Sorting*/
  }
  const sortedRepos = [...repos].sort((a, b) => {
    return sortDirection === "desc"
      ? b.stargazers_count - a.stargazers_count
      : a.stargazers_count - b.stargazers_count;
  });

  {
    /* Pagination Handling */
  }
  const { currentItems: currentRepos, totalPages } = calculatePagination(
    sortedRepos,
    currentPage,
    itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  {
    /* Toggle Sort */
  }
  const toggleSort = () => {
    setSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  };

  {
    /* Lifecycle,Api Call */
  }
  useEffect(() => {
    if (!username) {
      setRepos([]);
      return;
    }
    setLoading(true);

    fetchUserRepositories(username)
      .then((response) => {
        setRepos(response || []);
        setLoading(false);
      })
      .catch(() => {
        toast.error("Error getting user repositories");
        setRepos([]);
        setLoading(false);
      });
  }, [username]);

  {
    /* Markup */
  }
  if (!username) {
    return <p>No user selected</p>;
  }

  if (loading) {
    return <p>Loading repositories...</p>;
  }

  return (
    <div className="container py-5">
      {/* Title */}
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

          {/* Sorting Button */}
          {repos.length > 0 && (
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={toggleSort}
              >
                <i className="fas fa-star me-1"></i>
                Sort by stars
                {sortDirection === "desc" ? (
                  <i className="fas fa-sort-down ms-1"></i>
                ) : (
                  <i className="fas fa-sort-up ms-1"></i>
                )}
              </button>
            </div>
          )}
          {/* List of Repositories */}
          <div className="card shadow-sm">
            <div className="list-group list-group-flush">
              {currentRepos &&
                currentRepos.map((repo) => (
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

          {/* Pagination Controls */}
          {repos.length > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-4">
              <div className="d-flex align-items-center">
                <label className="me-2">Items per page:</label>
                <select
                  className="form-select form-select-sm w-auto"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                  <option value="200">200</option>
                </select>
              </div>

              <nav aria-label="Repository pagination">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>

                  {getPageRange(currentPage, totalPages).map((page, index) =>
                    page === "..." ? (
                      <li
                        key={`ellipsis-${index}`}
                        className="page-item disabled"
                      >
                        <span className="page-link">...</span>
                      </li>
                    ) : (
                      <li
                        key={page}
                        className={`page-item ${
                          currentPage === page ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      </li>
                    )
                  )}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}

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
