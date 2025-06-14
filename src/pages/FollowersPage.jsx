import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserFollowers } from "../api/github";
import { getPageRange, calculatePagination } from "../utilities/pagination";

function FollowersPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("user");
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  {
    /* Pagination Handling */
  }
  const { currentItems: currentFollowers, totalPages } = calculatePagination(
    followers,
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
    /* Lifecycle,Api Call */
  }
  useEffect(() => {
    if (!username) {
      setFollowers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchUserFollowers(username)
      .then((response) => {
        setFollowers(response || []);
      })
      .catch((error) => {
        toast.error("Error getting user followers");
        setFollowers([]);
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username]);

  if (!username) {
    return <p>No user selected</p>;
  }

  if (loading) {
    return <p>Loading followers...</p>;
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-12">
          {/* Header Section */}
          <div className="header-section text-center">
            <h2 className="display-6 mb-4">Followers</h2>
            <h3 className="h4 mb-4">
              <a
                href={`https://github.com/${username}`}
                target="_blank"
                rel="noreferrer"
                className="username-link"
              >
                {username}
              </a>
            </h3>

            <div className="d-flex align-items-center justify-content-center gap-4 mt-4">
              <button
                className="btn btn-outline-secondary start-over-btn"
                onClick={() => navigate(`/?user=${username}`)}
              >
                <i className="fas fa-arrow-left me-2"></i>
                Back to Profile
              </button>
              <span className="followers-badge badge bg-primary">
                <i className="fas fa-users me-2"></i>
                {followers.length.toLocaleString()} followers
              </span>
            </div>
          </div>

          {/* Followers List */}
          <div className="card shadow-sm">
            <div className="list-group list-group-flush">
              {currentFollowers &&
                currentFollowers.map((follower) => (
                  <div
                    key={follower.id}
                    className="list-group-item list-group-item-action p-4"
                  >
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0">
                        <img
                          src={follower.avatar_url}
                          alt={`${follower.login}'s avatar`}
                          className="rounded-circle avatar-img"
                          width="60"
                          height="60"
                        />
                      </div>
                      <div className="ms-4">
                        <h5 className="mb-1">
                          <a
                            href={follower.html_url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-decoration-none link-dark hover-effect"
                          >
                            {follower.login}
                          </a>
                        </h5>
                        <p className="text-muted mb-0">
                          <i
                            className={`fas fa-${
                              follower.type === "User" ? "user" : "building"
                            } me-2`}
                          ></i>
                          {follower.type}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* Pagination Controls */}
          {currentFollowers.length > 0 && (
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

              <nav aria-label="Follower pagination">
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
          {followers.length === 0 && !loading && (
            <div className="text-center mt-5">
              <i className="fas fa-users fa-3x text-muted mb-3"></i>
              <p className="text-muted">This user has no followers yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowersPage;
