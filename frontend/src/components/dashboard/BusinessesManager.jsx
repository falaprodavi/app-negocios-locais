import { useState, useEffect } from "react";
import BusinessService from "../../api/services/business";
import CategoryService from "../../api/services/category";
import SubCategoryService from "../../api/services/subcategory";
import CityService from "../../api/services/city";
import NeighborhoodService from "../../api/services/neighborhood";
import { slugify } from "../../utils/helpers";
import useScrollToTop from "../../hooks/useScrollToTop";

const BusinessesManager = () => {
  useScrollToTop();
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    phone: "",
    whatsapp: "",
    photos: [],
    address: {
      street: "",
      number: "",
      city: "",
      neighborhood: "",
    },
    lat: "",
    long: "",
    category: "",
    subCategory: "",
    instagram: "",
    facebook: "",
    linkedin: "",
    twitter: "",
    tiktok: "",
    video: "",
  });
  const [previewImages, setPreviewImages] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [businessesData, categoriesData, citiesData] = await Promise.all([
        BusinessService.getAll(),
        CategoryService.getAll(),
        CityService.getAll(),
      ]);

      setBusinesses(businessesData.data);
      setCategories(categoriesData);
      setCities(citiesData);
      setLoading(false);
    } catch (error) {
      setMessage({ text: "Erro ao carregar dados", type: "error" });
      setLoading(false);
    }
  };

  const fetchNeighborhoods = async (cityId) => {
    try {
      if (!cityId) return;
      const data = await NeighborhoodService.getByCity(cityId);
      setNeighborhoods(data);
    } catch (error) {
      console.error("Erro ao carregar bairros:", error);
    }
  };

  // Adicione este useEffect para monitorar mudanças na categoria selecionada
  useEffect(() => {
    if (formData.category) {
      fetchSubCategories(formData.category);
    } else {
      setSubCategories([]);
      setFormData((prev) => ({ ...prev, subCategory: "" }));
    }
  }, [formData.category]);

  const fetchSubCategories = async (categoryId) => {
    try {
      // Primeiro obtenha o slug da categoria
      const category = categories.find((c) => c._id === categoryId);
      if (!category) return;

      const data = await SubCategoryService.getByCategory(category.slug);
      setSubCategories(data);

      // Atualize o formulário mantendo a subcategoria se existir
      setFormData((prev) => ({
        ...prev,
        subCategory: data.some((sc) => sc._id === prev.subCategory)
          ? prev.subCategory
          : "",
      }));
    } catch (error) {
      console.error("Erro ao carregar subcategorias:", error);
      setSubCategories([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        address: {
          ...formData.address,
          [field]: value,
        },
      });

      // Atualizar bairros quando a cidade mudar
      if (field === "city") {
        fetchNeighborhoods(value);
      }
    } else if (name === "category") {
      setFormData({
        ...formData,
        [name]: value,
        subCategory: "", // Reset subcategoria quando muda categoria
      });
      fetchSubCategories(value);
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 0) {
      const newPreviewImages = [];
      const loadedImages = [];

      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newPreviewImages.push(reader.result);
          loadedImages.push(file);

          if (newPreviewImages.length === files.length) {
            setPreviewImages([...previewImages, ...newPreviewImages]);
            setFormData({
              ...formData,
              photos: [...formData.photos, ...loadedImages],
            });
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    const newPreviewImages = [...previewImages];
    newPreviewImages.splice(index, 1);

    const newPhotos = [...formData.photos];
    newPhotos.splice(index, 1);

    setPreviewImages(newPreviewImages);
    setFormData({
      ...formData,
      photos: newPhotos,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();

      // Adicionar campos básicos
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("whatsapp", formData.whatsapp);
      formDataToSend.append("address[street]", formData.address.street);
      formDataToSend.append("address[number]", formData.address.number);
      formDataToSend.append("address[city]", formData.address.city);
      formDataToSend.append(
        "address[neighborhood]",
        formData.address.neighborhood
      );
      formDataToSend.append("lat", formData.lat);
      formDataToSend.append("long", formData.long);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("subCategory", formData.subCategory);
      formDataToSend.append("instagram", formData.instagram);
      formDataToSend.append("facebook", formData.facebook);
      formDataToSend.append("linkedin", formData.linkedin);
      formDataToSend.append("twitter", formData.twitter);
      formDataToSend.append("tiktok", formData.tiktok);
      formDataToSend.append("video", formData.video);

      // Adicionar fotos
      formData.photos.forEach((photo, index) => {
        if (photo instanceof File) {
          formDataToSend.append("photos", photo);
        }
      });

      if (editingId) {
        await BusinessService.update(editingId, formDataToSend);
        setMessage({
          text: "Estabelecimento atualizado com sucesso!",
          type: "success",
        });
      } else {
        await BusinessService.create(formDataToSend);
        setMessage({
          text: "Estabelecimento criado com sucesso!",
          type: "success",
        });
      }

      fetchData();
      resetForm();
    } catch (error) {
      setMessage({
        text:
          error.response?.data?.message ||
          error.message ||
          "Erro ao salvar estabelecimento",
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      phone: "",
      whatsapp: "",
      photos: [],
      address: {
        street: "",
        number: "",
        city: "",
        neighborhood: "",
      },
      lat: "",
      long: "",
      category: "",
      subCategory: "",
      instagram: "",
      facebook: "",
      linkedin: "",
      twitter: "",
      tiktok: "",
      video: "",
    });
    setPreviewImages([]);
    setEditingId(null);
  };

  const handleEdit = async (business) => {
    try {
      setLoading(true);
      const response = await BusinessService.getById(business._id);
      const businessData = response.data;

      // Carregar bairros se houver cidade
      if (businessData.address?.city?._id) {
        await fetchNeighborhoods(businessData.address.city._id);
      }

      // Carregar subcategorias (agora usando getByCategoryId)
      const subCats = await SubCategoryService.getByCategoryId(
        businessData.category?._id
      );
      setSubCategories(subCats);

      setFormData({
        name: businessData.name || "",
        description: businessData.description || "",
        phone: businessData.phone || "",
        whatsapp: businessData.whatsapp || "",
        photos: businessData.photos || [],
        address: {
          street: businessData.address?.street || "",
          number: businessData.address?.number || "",
          city: businessData.address?.city?._id || "",
          neighborhood: businessData.address?.neighborhood?._id || "",
        },
        lat: businessData.lat || "",
        long: businessData.long || "",
        category: businessData.category?._id || "",
        subCategory: businessData.subCategory?._id || "",
        instagram: businessData.instagram || "",
        facebook: businessData.facebook || "",
        linkedin: businessData.linkedin || "",
        twitter: businessData.twitter || "",
        tiktok: businessData.tiktok || "",
        video: businessData.video || "",
      });

      setPreviewImages(businessData.photos || []);
      setEditingId(business._id);
    } catch (error) {
      console.error("Erro ao editar:", error);
      setMessage({
        text: "Erro ao carregar dados do estabelecimento",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Tem certeza que deseja excluir este estabelecimento?")
    ) {
      try {
        await BusinessService.delete(id);
        setMessage({
          text: "Estabelecimento excluído com sucesso!",
          type: "success",
        });
        await fetchData();

        if (editingId === id) {
          resetForm();
        }
      } catch (error) {
        setMessage({
          text:
            error.response?.data?.message || "Erro ao excluir estabelecimento",
          type: "error",
        });
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Gerenciar Estabelecimentos</h2>

      {message.text && (
        <div
          className={`p-4 mb-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          {editingId
            ? "Editar Estabelecimento"
            : "Adicionar Novo Estabelecimento"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome*
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descrição*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows="3"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Telefone*
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WhatsApp
              </label>
              <input
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria*
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subcategoria*
              </label>
              <select
                name="subCategory"
                value={formData.subCategory}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={!formData.category || loading}
              >
                <option value="">
                  {loading ? "Carregando..." : "Selecione uma subcategoria"}
                </option>
                {subCategories.map((subCategory) => (
                  <option key={subCategory._id} value={subCategory._id}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
              {!loading && formData.category && subCategories.length === 0 && (
                <p className="text-xs text-red-500 mt-1">
                  Nenhuma subcategoria disponível para esta categoria
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade*
              </label>
              <select
                name="address.city"
                value={formData.address.city}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecione uma cidade</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>
                    {city.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bairro*
              </label>
              <select
                name="address.neighborhood"
                value={formData.address.neighborhood}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
                disabled={!formData.address.city}
              >
                <option value="">Selecione um bairro</option>
                {neighborhoods.map((neighborhood) => (
                  <option key={neighborhood._id} value={neighborhood._id}>
                    {neighborhood.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rua*
              </label>
              <input
                type="text"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número*
              </label>
              <input
                type="text"
                name="address.number"
                value={formData.address.number}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lat
              </label>
              <input
                type="text"
                name="lat"
                value={formData.lat}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Long
              </label>
              <input
                type="text"
                name="long"
                value={formData.long}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fotos (Máx. 10)
            </label>
            <div className="flex flex-wrap gap-4 mb-4">
              {previewImages.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-md file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
              accept="image/*"
              multiple
              max="10"
            />
            <p className="mt-1 text-xs text-gray-500">
              PNG, JPG, JPEG até 5MB cada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Instagram
              </label>
              <input
                type="text"
                name="instagram"
                value={formData.instagram}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Facebook
              </label>
              <input
                type="text"
                name="facebook"
                value={formData.facebook}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                LinkedIn
              </label>
              <input
                type="text"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twitter
              </label>
              <input
                type="text"
                name="twitter"
                value={formData.twitter}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                TikTok
              </label>
              <input
                type="text"
                name="tiktok"
                value={formData.tiktok}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vídeo (URL)
              </label>
              <input
                type="text"
                name="video"
                value={formData.video}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingId ? "Atualizar" : "Adicionar"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancelar
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Lista de Estabelecimentos */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">
          Lista de Estabelecimentos
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cidade
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {businesses.map((business) => (
                <tr key={business._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {business.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {business.category?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {business.address?.city?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap space-x-2">
                    <button
                      onClick={() => handleEdit(business)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(business._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BusinessesManager;
