import React, { useState, useEffect } from "react";
import BusinessService from "../../api/services/business";
import StatsCard from "./StatsCard";
import Card from "../../components/Card";
import MonthlyBusinessChart from "./MonthlyBusinessChart";

const DashboardManager = () => {
  const [stats, setStats] = useState({
    businesses: 0,
    cities: 0,
    categories: 0,
  });
  const [recentBusinesses, setRecentBusinesses] = useState([]);
  const [loading, setLoading] = useState({
    stats: true,
    recent: true,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Busca estatísticas
        const statsRes = await BusinessService.getDashboardStats();
        setStats({
          businesses: statsRes.data.data.totalBusinesses,
          cities: statsRes.data.data.totalCities,
          categories: statsRes.data.data.totalCategories,
        });

        // Busca últimos estabelecimentos
        const businessesRes = await BusinessService.getRecentBusinesses();
        setRecentBusinesses(businessesRes.data.data);

        setLoading({ stats: false, recent: false });
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError(err.message);
        setLoading({ stats: false, recent: false });
      }
    };

    fetchDashboardData();
  }, []);

  if (error)
    return <div className="text-center p-8 text-red-500">Erro: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Seção de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <StatsCard
          title="Estabelecimentos"
          value={stats.businesses}
          loading={loading.stats}
          icon="🏢"
        />
        <StatsCard
          title="Cidades"
          value={stats.cities}
          loading={loading.stats}
          icon="🌆"
        />
        <StatsCard
          title="Categorias"
          value={stats.categories}
          loading={loading.stats}
          icon="🏷️"
        />
      </div>

      <div className="grid grid-cols-1 gap-8 mb-8">
        <MonthlyBusinessChart />
        {/* Outros componentes... */}
      </div>

      {/* Seção de Últimos Estabelecimentos */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Últimos Estabelecimentos Cadastrados
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading.recent ? (
            Array(6)
              .fill()
              .map((_, i) => <Card key={`skeleton-${i}`} loading={true} />)
          ) : recentBusinesses.length > 0 ? (
            recentBusinesses.map((business) => (
              <Card key={business._id} business={business} />
            ))
          ) : (
            <div className="col-span-full text-center py-8 text-gray-500">
              Nenhum estabelecimento recente encontrado
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardManager;
