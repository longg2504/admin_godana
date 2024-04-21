
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api' });

export const fetchPlaces = (params) => API.get('/place', { params });
export const fetchPlaceById = (id) => API.get(`/place/${id}`);
export const createPlace = (data) => API.post('/place', data);
export const fetchUpdatePlaceById = (id, data) => API.patch(`/place/${id}`, data);
export const fetchPlaceSearch = (categoryId,search) => API.get(`/place?category=${categoryId}&search=${search}`);

