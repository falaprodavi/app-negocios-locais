import api from "../axios";

const CategoryService = {
  getAll: async () => {
    const response = await api.get("/categories");
    return response.data;
  },
};
export default CategoryService;
