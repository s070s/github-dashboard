import axios from "axios";

/*Base Url for API Calls*/
const BASE_URL = "https://api.github.com/users";

// Fetch a User
export const fetchUserProfile = (username) =>
  axios.get(`${BASE_URL}/${username}`);
// Fetch a User's Repositories
export const fetchUserRepositories = async (username, per_page = 100) => {
  let allRepositories = [];
  let page = 1;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      //API request for a single page of repositories
      const response = await axios.get(`${BASE_URL}/${username}/repos`, {
        params: {
          per_page,
          page,
        },
      });

      const repositories = response.data;
      if (repositories.length === 0 || repositories.length < per_page) {
        hasMorePages = false;
      }

      allRepositories = [...allRepositories, ...repositories];
      page++;
      // Add delay between requests to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return allRepositories;
  } catch (error) {
    //API error handling
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error(`User ${username} not found`);
        case 403:
          throw new Error("API rate limit exceeded");
        default:
          throw new Error(`GitHub API error: ${error.response.status}`);
      }
    }
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
};
//Fetch a User's Followers
export const fetchUserFollowers = async (username, per_page = 100) => {
  let allFollowers = [];
  let page = 1;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      //API request for a single page of followers
      const response = await axios.get(`${BASE_URL}/${username}/followers`, {
        params: {
          per_page,
          page,
        },
      });

      const followers = response.data;

      if (followers.length === 0 || followers.length < per_page) {
        hasMorePages = false;
      }

      allFollowers = [...allFollowers, ...followers];
      page++;

      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return allFollowers;
  } catch (error) {
    //API error handling
    if (error.response) {
      switch (error.response.status) {
        case 404:
          throw new Error(`User ${username} not found`);
        case 403:
          throw new Error("API rate limit exceeded");
        default:
          throw new Error(`GitHub API error: ${error.response.status}`);
      }
    }
    throw new Error(`Failed to fetch followers: ${error.message}`);
  }
};
