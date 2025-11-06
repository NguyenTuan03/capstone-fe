import axios from 'axios';

const apiConfig = axios.create({
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});
export default apiConfig;
