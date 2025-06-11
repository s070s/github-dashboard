import axios from "axios";

/*Barebones Get for a user and his/her repos,followers*/

const BASE_URL = "https://api.github.com/users";

export const fetchUserProfile = (username) =>
  axios.get(`${BASE_URL}/${username}`);
export const fetchUserRepositories = (username) =>
  axios.get(`${BASE_URL}/${username}/repos`);
export const fetchUserFollowers = (username) =>
  axios.get(`${BASE_URL}/${username}/followers`);
