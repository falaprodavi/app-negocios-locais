import api from "../axios";

const BusinessService = {
  getLatest: async (limit = 6) => {
    try {
      const response = await api.get(`/businesses/latest?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  search: async (params) => {
    try {
      const query = new URLSearchParams(params).toString();
      const response = await api.get(`/businesses/search?${query}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAll: async () => {
    try {
      const response = await api.get("/businesses");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/businesses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (businessData) => {
    try {
      const response = await api.post("/businesses", businessData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, businessData) => {
    try {
      const response = await api.put(`/businesses/${id}`, businessData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/businesses/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default BusinessService;
