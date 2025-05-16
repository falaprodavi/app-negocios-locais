import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const SearchForm = () => {
  const [searchParams, setSearchParams] = useState({
    name: "",
    city: "",
    neighborhood: "",
    category: "",
    subcategory: "",
  });

  const [cities, setCities] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Carrega dados iniciais
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          axios.get("http://localhost:5000/api/cities"),
          axios.get("http://localhost:5000/api/categories"),
        ]);

        setCities(citiesRes.data);
        setCategories(categoriesRes.data);

        // Parse URL parameters
        const params = new URLSearchParams(location.search);
        const initialParams = {
          name: params.get("name") || "",
          city: params.get("city") || "",
          neighborhood: params.get("neighborhood") || "",
          category: params.get("category") || "",
          subcategory: params.get("subcategory") || "",
        };

        setSearchParams(initialParams);

        // Carrega dados dependentes se existirem na URL
        if (initialParams.city) {
          loadNeighborhoods(initialParams.city);
        }
        if (initialParams.category) {
          loadSubCategories(initialParams.category);
        }

        // Se houver parâmetros na URL, faz a busca automaticamente
        if (Object.values(initialParams).some((param) => param)) {
          handleSearchSubmit({ preventDefault: () => {} });
        }
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };

    fetchInitialData();
  }, [location.search]);

  // Carrega bairros por slug da cidade
  const loadNeighborhoods = async (citySlug) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/neighborhoods?city=${citySlug}`
      );
      setNeighborhoods(res.data);
    } catch (error) {
      console.error("Error loading neighborhoods:", error);
      setNeighborhoods([]);
    }
  };

  // Carrega subcategorias por slug da categoria
  const loadSubCategories = async (categorySlug) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/subcategories?category=${categorySlug}`
      );
      setSubCategories(res.data);
    } catch (error) {
      console.error("Error loading subcategories:", error);
      setSubCategories([]);
    }
  };

  // Atualiza os parâmetros de busca
  const handleSearchChange = async (e) => {
    const { name, value } = e.target;
    const newParams = { ...searchParams, [name]: value };

    // Reset de campos dependentes
    if (name === "city") {
      newParams.neighborhood = "";
      setNeighborhoods([]);
    }

    if (name === "category") {
      newParams.subcategory = "";
      setSubCategories([]);
    }

    setSearchParams(newParams);

    // Carrega dados dependentes
    if (name === "city" && value) {
      await loadNeighborhoods(value);
    }

    if (name === "category" && value) {
      await loadSubCategories(value);
    }
  };

  // Executa a busca
  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    const queryParams = new URLSearchParams();
    if (searchParams.name) queryParams.set("name", searchParams.name);
    if (searchParams.city) queryParams.set("city", searchParams.city);
    if (searchParams.neighborhood)
      queryParams.set("neighborhood", searchParams.neighborhood);
    if (searchParams.category)
      queryParams.set("category", searchParams.category);
    if (searchParams.subcategory)
      queryParams.set("subcategory", searchParams.subcategory);

    // Redireciona para a página Explore com os parâmetros
    navigate(`/explore?${queryParams.toString()}`);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-8 rounded-2xl bg-white/70 backdrop-blur-md shadow-xl shadow-black/10">
      <form
        onSubmit={handleSearchSubmit}
        className="flex flex-col md:flex-row md:items-end md:space-x-4 space-y-4 md:space-y-0"
      >
        {/* Campo de Nome */}
        <div className="flex-1">
          <input
            type="text"
            name="name"
            value={searchParams.name}
            onChange={handleSearchChange}
            placeholder="Digite o nome"
            className="w-full px-4 py-1.5 rounded-lg border border-gray-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Cidade */}
        <div className="flex-1 md:w-48">
          <select
            name="city"
            value={searchParams.city}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Cidades</option>
            {cities.map((city) => (
              <option key={city._id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bairro (só aparece quando cidade selecionada) */}
        {searchParams.city && (
          <div className="flex-1 md:w-48">
            <select
              name="neighborhood"
              value={searchParams.neighborhood}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Bairros</option>
              {neighborhoods.length > 0 ? (
                neighborhoods.map((n) => (
                  <option key={n._id} value={n.slug}>
                    {n.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nenhum bairro encontrado para esta cidade
                </option>
              )}
            </select>
          </div>
        )}

        {/* Categoria */}
        <div className="flex-1 md:w-48">
          <select
            name="category"
            value={searchParams.category}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Categorias</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategoria (só aparece quando categoria selecionada) */}
        {searchParams.category && (
          <div className="flex-1 md:w-48">
            <select
              name="subcategory"
              value={searchParams.subcategory}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Subcategoria</option>
              {subCategories.length > 0 ? (
                subCategories.map((sub) => (
                  <option key={sub._id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nenhuma subcategoria encontrada para esta categoria
                </option>
              )}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full md:w-auto px-6 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          Buscar
        </button>
      </form>

      {/* Resultados */}
    </div>
  );
};

export default SearchForm;
