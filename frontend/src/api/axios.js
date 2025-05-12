import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api', // URL do seu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar o token JWT às requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar erros globais
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      // Token expirado ou inválido - redirecionar para login
      localStorage.removeItem('token');
      window.location = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;