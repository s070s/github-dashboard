import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserFollowers } from "../api/github";

function FollowersPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("user");
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const followersPerPage = 10;

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetchUserFollowers(username)
      .then((response) => {
        setFollowers(response.data);
        setCurrentPage(1); // Reset to first page when loading new user
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

  // Get current followers
  const indexOfLastFollower = currentPage * followersPerPage;
  const indexOfFirstFollower = indexOfLastFollower - followersPerPage;
  const currentFollowers = followers.slice(
    indexOfFirstFollower,
    indexOfLastFollower
  );
  const totalPages = Math.ceil(followers.length / followersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (!username) {
    return <p>No user selected</p>;
  }

  if (loading) {
    return <p>Loading followers...</p>;
  }

  return (
    <div className="followers-page">
      <div className="d-flex align-items-center mb-4">
        <h2 className="mb-0 me-2">Followers of</h2>
        <h2 className="username-title mb-0">
          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noreferrer"
            className="text-decoration-none text-dark"
          >
            {username}
          </a>
        </h2>
        <span className="ms-3 badge bg-primary">
          {followers.length} followers
        </span>
      </div>

      <div className="list-group mb-4">
        {currentFollowers.map((follower) => (
          <div key={follower.id} className="list-group-item">
            <div className="d-flex align-items-center">
              <img
                src={follower.avatar_url}
                alt={`${follower.login}'s avatar`}
                className="rounded-circle me-3"
                width="50"
                height="50"
              />
              <div className="d-flex flex-column align-items-start">
                <h5 className="follower-title mb-0">
                  <a
                    href={follower.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-dark"
                  >
                    {follower.login}
                  </a>
                </h5>
                <p className="text-muted">
                  {follower.type === "User" ? "User" : "Organization"}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {followers.length > 0 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                currentPage === totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {followers.length === 0 && !loading && (
        <p className="text-muted">This user has no followers.</p>
      )}
    </div>
  );
}

export default FollowersPage;
