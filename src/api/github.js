import axios from "axios";

/*Barebones Get for a user and his/her repos,followers*/

const BASE_URL = "https://api.github.com/users";

export const fetchUserProfile = (username) =>
  axios.get(`${BASE_URL}/${username}`);

export const fetchUserRepositories = async (username, per_page = 100) => {
  let allRepositories = [];
  let page = 1;
  let hasMorePages = true;

  try {
    while (hasMorePages) {
      const response = await axios.get(`${BASE_URL}/${username}/repos`, {
        params: {
          per_page,
          page,
        },
      });

      const repositories = response.data;

      // If we get fewer repos than perPage or an empty array, we've reached the end
      if (repositories.length === 0 || repositories.length < per_page) {
        hasMorePages = false;
      }

      allRepositories = [...allRepositories, ...repositories];
      page++;

      // 2ms Delay to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    return allRepositories;
  } catch (error) {
    if (error.response) {
      // HTTP errors
      switch (error.response.status) {
        case 404:
          throw new Error(`User ${username} not found`);
        case 403:
          throw new Error("API rate limit exceeded");
        default:
          throw new Error(`GitHub API error: ${error.response.status}`);
      }
    }
    // General Error
    throw new Error(`Failed to fetch repositories: ${error.message}`);
  }
};
export const fetchUserFollowers = (username) =>
  axios.get(`${BASE_URL}/${username}/followers`);
