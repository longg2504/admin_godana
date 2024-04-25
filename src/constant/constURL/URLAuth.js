import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api/auth' });

export const registerUser = async (formData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return await API.post('/registerUser', formData, config);
};

// Admin registration with JSON payload
export const registerAdmin = async (adminData) => {
  return await API.post('/register', adminData);
};

// User login with JSON payload
export const loginUser = async (loginData) => {
  return await API.post('/login', loginData);
};
