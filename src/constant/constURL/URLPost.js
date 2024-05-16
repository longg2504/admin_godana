
import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api' });

export const getAllPost = () => {
    return API.get(`/post`);
  };
export const getAllPostsByCategory = (categoryId) => {
    return API.get(`/post?category=${categoryId}`);
  };