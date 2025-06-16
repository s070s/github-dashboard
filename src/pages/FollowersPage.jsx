import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserFollowers } from "../api/github";
import { calculatePagination } from "../utilities/pagination";
import Pager from "../components/Pager";

function FollowersPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const username = searchParams.get("user");
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(25);

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
        {
          /*API Error Handling*/
        }
        setFollowers([]);
        switch (error.response?.status) {
          case 401:
            toast.error("Unauthorized");
            break;
          case 403:
            toast.error("Forbidden: You may have exceeded the rate limit");
            break;
          case 404:
            toast.error(`Followers not found`);
            break;
          case 429:
            toast.error("Rate limit exceeded. Please try again later");
            break;
          case 500:
            toast.error("Unexpected server error. Please try again later");
            break;
          default:
            toast.error("Error fetching followers");
        }
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
            <Pager
              currentPage={currentPage}
              totalPages={totalPages}
              itemsPerPage={itemsPerPage}
              onPageChange={handlePageChange}
              onItemsPerPageChange={(value) => {
                setItemsPerPage(value);
                setCurrentPage(1);
              }}
            />
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
