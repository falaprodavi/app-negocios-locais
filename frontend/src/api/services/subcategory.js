import api from "../axios";
const SubcategoryService = {
  getAll: async () => {
    const response = await api.get("/subcategories/by-category/:slug");
    return response.data;
  },
};
export default SubcategoryService;
