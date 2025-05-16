import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Card from "../components/Card";
import useScrollToTop from "../hooks/useScrollToTop";

const Explore = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(() => {
    const page = parseInt(searchParams.get("page")) || 1;
    const perPage = parseInt(searchParams.get("perPage")) || 9;
    return { page, perPage, total: 0 };
  });

  useScrollToTop([pagination.page, searchParams]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(searchParams.toString()); // Mantém todos os parâmetros existentes

      // Garante que os parâmetros de paginação estão atualizados
      queryParams.set("page", pagination.page);
      queryParams.set("perPage", pagination.perPage);

      const res = await api.get(`/businesses/search?${queryParams.toString()}`);

      setResults(res.data.data);
      setPagination((prev) => ({
        ...prev,
        total: res.data.pagination.total,
        totalPages: res.data.pagination.totalPages, // Opcional
      }));
    } catch (err) {
      console.error("Erro ao buscar:", err);
      setError("Ocorreu um erro ao carregar os resultados");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [pagination.page, pagination.perPage]);

  const handlePageChange = (newPage) => {
    const newPagination = { ...pagination, page: newPage };
    setPagination(newPagination);

    // Atualiza a URL sem disparar um novo fetch
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage);
    navigate(`?${params.toString()}`, { replace: true });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handlePerPageChange = (value) => {
    const newPerPage = parseInt(value);
    const newPagination = {
      ...pagination,
      perPage: newPerPage,
      page: 1,
    };
    setPagination(newPagination);

    // Atualiza a URL
    const params = new URLSearchParams(searchParams);
    params.set("perPage", newPerPage);
    params.set("page", "1");
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleSearchSubmit = (params) => {
    const newSearchParams = new URLSearchParams();

    // Adiciona os novos parâmetros de busca
    Object.entries(params).forEach(([key, value]) => {
      if (value) newSearchParams.set(key, value);
    });

    // Mantém a paginação
    newSearchParams.set("page", "1");
    newSearchParams.set("perPage", pagination.perPage.toString());

    // Atualiza a URL e reseta a paginação
    navigate(`?${newSearchParams.toString()}`);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const totalPages = Math.ceil(pagination.total / pagination.perPage);

  if (loading) return <div className="p-4 mt-24">Carregando...</div>;
  if (error) return <div className="p-4 mt-24 text-red-500">{error}</div>;

  console.log("Pagination state:", pagination);
  console.log("URL params:", searchParams.toString());
  console.log("Total pages:", totalPages);

  return (
    <div className="mt-24 p-4 flex flex-col lg:flex-row gap-8">
      {/* Sidebar com SearchForm */}
      <aside className="w-full lg:w-64 space-y-6"></aside>

      {/* Conteúdo principal */}
      <main className="flex-1">
        <h1 className="text-2xl font-semibold mb-6">
          Resultados <span className="text-gray-500">({pagination.total})</span>
        </h1>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Seletor de itens por página */}
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <label htmlFor="perPage" className="whitespace-nowrap">
              Exibir:
            </label>
            <select
              id="perPage"
              value={pagination.perPage}
              onChange={(e) => handlePerPageChange(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="9">9 por página</option>
              <option value="12">12 por página</option>
              <option value="24">24 por página</option>
            </select>
          </div>

          {/* Info da página atual */}
          <div className="text-sm text-gray-500">
            Página{" "}
            <span className="font-medium text-gray-800">{pagination.page}</span>{" "}
            de <span className="font-medium text-gray-800">{totalPages}</span>
          </div>
        </div>

        {/* Resultados */}
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Nenhum estabelecimento encontrado com os filtros atuais
            </p>
            <button
              onClick={() => handleSearchSubmit({})}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Limpar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map((business) => (
                <Card key={business._id} business={business} />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-10">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Anterior
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.page >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = pagination.page - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-4 py-2 rounded-lg transition ${
                        pagination.page === pageNum
                          ? "bg-black text-white"
                          : "border border-gray-300 text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 transition"
                >
                  Próxima
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Explore;
