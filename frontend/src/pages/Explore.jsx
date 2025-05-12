import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const query = searchParams.toString();
        const res = await api.get(`/businesses/search?${query}`);
        setResults(res.data.data);
      } catch (err) {
        console.error("Erro ao buscar:", err);
      }
    };

    fetchResults();
  }, [searchParams]);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Resultados</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((biz) => (
          <div key={biz._id} className="border rounded p-4 shadow">
            {biz.photos?.[0] && (
              <img
                src={biz.photos[0]}
                alt={biz.name}
                className="h-40 w-full object-cover rounded mb-2"
              />
            )}
            <h2 className="text-lg font-bold">{biz.name}</h2>
            <p className="text-gray-600 text-sm">{biz.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
