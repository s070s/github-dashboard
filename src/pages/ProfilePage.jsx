import { Link, useSearchParams, useLocation } from "react-router-dom";

function ProfilePage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const username = searchParams.get("user");

  if (!location.state?.userData) {
    return (
      <p className="text-muted">
        No profile data found. Please search for a GitHub user first.
      </p>
    );
  }
  const userData = location.state.userData;

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
