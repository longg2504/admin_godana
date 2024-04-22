import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api' });

export const fetchUsers = (params) => API.get('/user', { params });
export const creatUser = (data) => API.post('/user', data);
export const fetchUserSearch = (userId,search) => API.get(`/user?userID=${userId}&search=${search}`);