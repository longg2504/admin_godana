
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api' });

export const fetchCategory = (params) => API.get('/category', { params });
export const fetchCategoryId = (id) => API.get(`/category/${id}`);
export const createCategory = (data) => API.post('/category', data);

