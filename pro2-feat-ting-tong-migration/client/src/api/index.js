// Plik: client/src/api/index.js
// Konfiguracja instancji Axios do komunikacji z API

import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Używamy ścieżki relatywnej, resztą zajmie się proxy Vite
});

// Interceptor do dodawania tokena JWT do każdego zapytania
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

// Funkcja do pobierania slajdów
export const fetchSlides = () => api.get('/slides');

// Funkcje do autentykacji
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const getUserStatus = () => api.get('/auth/status');


export default api;
