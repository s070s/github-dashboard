import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { fetchUserProfile } from "../api/github";
import { Link } from "react-router-dom";

function ProfilePage() {
  const [searchParams] = useSearchParams();
  const username = searchParams.get("user");

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) return;

    setLoading(true);
    setError(null);

    fetchUserProfile(username)
      .then((response) => {
        setUserData(response.data);
        setLoading(false);
      })
      .catch(() => {
        setError("User not found or API error.");
        setUserData(null);
        setLoading(false);
      });
  }, [username]);

  if (!username) {
    return (
      <p className="text-muted">
        Search for a GitHub user to see their profile.
      </p>
    );
  }

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p className="text-danger">{error}</p>;
  }

  if (!userData) {
    return null; // avoid rendering before data is set
  }

  return (
    <div className="card">
      <div className="card-body d-flex align-items-center">
        <img
          src={userData.avatar_url}
          alt="Avatar"
          className="rounded-circle me-3"
          width="100"
          height="100"
        />
        <div>
          <h5>{userData.name || userData.login}</h5>
          <p>{userData.bio}</p>
          <p>
            <strong>Public Repos:</strong>{" "}
            <Link to={`/repos?user=${username}`}>{userData.public_repos}</Link>
            &nbsp;
            <strong>Followers:</strong> {userData.followers}
          </p>
          <a href={userData.html_url} target="_blank" rel="noreferrer">
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
