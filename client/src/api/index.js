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
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funkcja do pobierania slajdów
export const fetchSlides = () => api.get('/slides');

// Funkcje do polubień
export const likeSlide = (slideId) => api.post(`/slides/${slideId}/like`);
export const unlikeSlide = (slideId) => api.delete(`/slides/${slideId}/like`);

// Funkcje do komentarzy
export const getComments = (slideId) => api.get(`/slides/${slideId}/comments`);
export const addComment = (slideId, commentData) => api.post(`/slides/${slideId}/comments`, commentData);
export const editComment = (commentId, commentData) => api.put(`/comments/${commentId}`, commentData);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

// Funkcje do użytkownika
export const uploadAvatar = (formData) => api.post('/users/avatar', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
export const getDonationHistory = () => api.get('/users/donations');

// Funkcje do autentykacji
export const registerUser = (userData) => api.post('/auth/register', userData);
export const loginUser = (userData) => api.post('/auth/login', userData);
export const getUserStatus = () => api.get('/auth/status');


export default api;
