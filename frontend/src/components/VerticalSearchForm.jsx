import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useSearch } from "../hooks/useSearch"; // Se criar um hook customizado

const VerticalSearchForm = () => {
  const {
    searchParams,
    cities,
    neighborhoods,
    categories,
    subCategories,
    handleSearchChange,
    handleSearchSubmit,
  } = useSearch();

  return (
    <div className="w-full bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold mb-4">Filtrar resultados</h3>
      <form onSubmit={handleSearchSubmit} className="space-y-4">
        {/* Campo de Nome */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nome do estabelecimento
          </label>
          <input
            type="text"
            name="name"
            value={searchParams.name}
            onChange={handleSearchChange}
            className="w-full px-4 py-1.5 rounded-lg border border-gray-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Digite o nome"
          />
        </div>

        {/* Cidade */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cidade
          </label>
          <select
            name="city"
            value={searchParams.city}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma cidade</option>
            {cities.map((city) => (
              <option key={city._id} value={city.slug}>
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* Bairro (só aparece quando cidade selecionada) */}
        {searchParams.city && (
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bairro
            </label>
            <select
              name="neighborhood"
              value={searchParams.neighborhood}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os bairros</option>
              {neighborhoods.length > 0 ? (
                neighborhoods.map((n) => (
                  <option key={n._id} value={n.slug}>
                    {n.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nenhum bairro encontrado
                </option>
              )}
            </select>
          </div>
        )}

        {/* Categoria */}
        <div className="form-group">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Categoria
          </label>
          <select
            name="category"
            value={searchParams.category}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas categorias</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Subcategoria (só aparece quando categoria selecionada) */}
        {searchParams.category && (
          <div className="form-group">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategoria
            </label>
            <select
              name="subcategory"
              value={searchParams.subcategory}
              onChange={handleSearchChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 text-gray-500 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todas subcategorias</option>
              {subCategories.length > 0 ? (
                subCategories.map((sub) => (
                  <option key={sub._id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  Nenhuma subcategoria encontrada
                </option>
              )}
            </select>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
        >
          Aplicar filtros
        </button>
      </form>
    </div>
  );
};

export default VerticalSearchForm;
