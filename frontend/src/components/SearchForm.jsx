import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const SearchForm = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const [cityRes, catRes] = await Promise.all([
        api.get("/cities"),
        api.get("/categories"),
      ]);
      setCities(cityRes.data.data);
      setCategories(catRes.data.data);
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (name) params.append("name", name);
    if (selectedCity) params.append("city", selectedCity);
    if (selectedCategory) params.append("category", selectedCategory);
    navigate(`/explore?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col gap-4 md:flex-row">
      <input
        type="text"
        placeholder="Buscar por nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 rounded w-full"
      />
      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Selecione uma cidade</option>
        {cities.map((c) => (
          <option key={c._id} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        className="border p-2 rounded w-full"
      >
        <option value="">Selecione uma categoria</option>
        {categories.map((c) => (
          <option key={c._id} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <button className="bg-blue-600 text-white p-2 rounded w-full md:w-auto">
        Buscar
      </button>
    </form>
  );
};

export default SearchForm;
