import axios from 'axios';

const apiConfig = axios.create({
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
  withCredentials: true,
});
export default apiConfig;
