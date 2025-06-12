import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { fetchUserFollowers } from "../api/github";

function FollowersPage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("user");
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!username) return;
    setLoading(true);
    fetchUserFollowers(username)
      .then((response) => {
        setFollowers(response.data);
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

      <div className="list-group">
        {followers.map((follower) => (
          <div key={follower.id} className="list-group-item">
            <div className="d-flex align-items-center">
              <img
                src={follower.avatar_url}
                alt={`${follower.login}'s avatar`}
                className="rounded-circle me-3"
                width="50"
                height="50"
              />
              <div>
                <h5 className="mb-1">
                  <a
                    href={follower.html_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-decoration-none text-dark"
                  >
                    {follower.login}
                  </a>
                </h5>
                <a
                  href={follower.html_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-muted text-decoration-none"
                >
                  View Profile
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {followers.length === 0 && !loading && (
        <p className="text-muted">This user has no followers.</p>
      )}
    </div>
  );
}

export default FollowersPage;
