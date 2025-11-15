
import axios, { AxiosError } from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use(config => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const getUserStatus = () => api.get('/auth/status');

export const uploadAvatar = (formData: FormData) => api.post('/users/avatar', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export const getDonationHistory = () => api.get('/users/donations');

export const getSlides = () => api.get('/slides');
export const createSlide = (slideData: unknown) => api.post('/slides', slideData);
export const updateSlide = (slideId: string, slideData: unknown) => api.put(`/slides/${slideId}`, slideData);
export const deleteSlide = (slideId: string) => api.delete(`/slides/${slideId}`);

export const likeSlide = (slideId: string) => api.post(`/slides/${slideId}/like`);
export const unlikeSlide = (slideId: string) => api.delete(`/slides/${slideId}/like`);

export const getComments = (slideId: string) => api.get(`/slides/${slideId}/comments`);
export const addComment = (slideId: string, commentData: { content: string; parent?: string }) => api.post(`/slides/${slideId}/comments`, commentData);
export const editComment = (commentId: string, commentData: { content: string }) => api.put(`/comments/${commentId}`, commentData);
export const deleteComment = (commentId: string) => api.delete(`/comments/${commentId}`);

export default api;
