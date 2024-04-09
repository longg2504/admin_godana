import axios from 'axios';

const API = axios.create({ baseURL: 'https://vapi.vnappmob.com/api/province' });

// Function để fetch các Districts
export const fetchDistrict = () => API.get('/district/48');
// Function để fetch các Wards dựa trên district ID
export const fetchWard = (districtId) => API.get(`/ward/${districtId}`);

export const fetchProvince = () => API.get('');