
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api' });

export const getAllPlace = () => API.get('/place' );
export const fetchPlaceById = (id) => API.get(`/place/${id}`);
export const createPlace = (data) => API.post('/place', data);
export const fetchUpdatePlaceById = (id, data) => API.post(`/place/${id}`, data);
export const getPlaceListByCategoryAndSearch = (categoryId,search) => API.get(`/place?category=${categoryId}&search=${search}`);
export const deletePlace = (placeId) => {
    return API.post(`/place/deleted/${placeId}`);
  };
