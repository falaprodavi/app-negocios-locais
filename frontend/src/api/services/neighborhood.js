import api from "../axios";
const NeighborhoodService = {
  getAll: async () => {
    const response = await api.get("/neighborhoods/by-city/:slug");
    return response.data;
  },
};
export default NeighborhoodService;
