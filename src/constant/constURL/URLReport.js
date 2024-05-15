import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:9000/api' });

export const getAllReport = () => {
    return API.get(`/report/get_all_report`);
  };