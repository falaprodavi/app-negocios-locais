import api from "../axios";

const CityService = {
  getAll: async () => {
    try {
      const response = await api.get("/cities");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPopularCities: async () => {
    try {
      const response = await api.get("/cities/popular");
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getActiveCities: async () => {
    try {
      const response = await api.get("/cities?active=true");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

export default CityService;
