import api from "./axios";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
  },

  register: async (name, email, phone, password) => {
    try {
      const response = await api.post("/auth/register", { name, email, phone, password });
      localStorage.setItem("token", response.data.token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      // Se for 404, retorna null para indicar que não está autenticado
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },
};

export default AuthService;
