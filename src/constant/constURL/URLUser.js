import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api' });

export const getAllUsers = (search) => {
    return API.get(`/user?search=${search}`);
  };
// Fetch banned users list with optional search and pagination
export const getAllBannedUsers = () => {
  return API.get(`/user/list-ban`);
};

// Ban a user by ID
export const banUser = (userId) => {
  return API.post(`/user/ban-user/${userId}`);
};

// Unban a user by ID
export const unbanUser = (userId) => {
  return API.post(`/user/unban-user/${userId}`);
};
