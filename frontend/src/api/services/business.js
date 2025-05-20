import api from "../axios";

const BusinessService = {
  getByOwner: async (ownerId) => {
    try {
      const response = await api.get(`/businesses/owner/${ownerId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

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

  getAll: async (page = 1, perPage = 10) => {
    try {
      const response = await api.get(
        `/businesses?page=${page}&perPage=${perPage}`
      );
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

  getBySlug: async (slug) => {
    try {
      const response = await api.get(`/businesses/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  search: async (filters = {}, page = 1, perPage = 9) => {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
      params.append("page", page);
      params.append("perPage", perPage);

      const response = await api.get(`/businesses/search?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  create: async (formData) => {
    try {
      const response = await api.post("/businesses", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  update: async (id, formData) => {
    try {
      const response = await api.put(`/businesses/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
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
      const enhancedError = new Error(
        error.response?.data?.message || "Falha ao excluir estabelecimento"
      );
      enhancedError.status = error.response?.status;
      enhancedError.details = error.response?.data;
      throw enhancedError;
    }
  },
};

export default BusinessService;
