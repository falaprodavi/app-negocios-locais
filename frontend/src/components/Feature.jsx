import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Title from "./Title";
import BusinessService from "../api/services/business";

const Feature = () => {
  const navigate = useNavigate();

  const [businesses, setBusinesses] = useState([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const res = await BusinessService.getLatest(4);
        setBusinesses(res.data);
      } catch (error) {
        console.error("Erro ao carregar estabelecimentos:", error.message);
      }
    };

    fetchLatest();
  }, []);

  return (
    <div className="flex flex-col items-center md:px-24 pt-20 mb-20 bg-slate-50 py-20">
      <Title
        title="Últimos estabelecimentos cadastrados"
        subTitle="Descubra as empresas cuidadosamente selecionadas para atender às suas necessidades!"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-4">
        {businesses.map((biz) => (
          <div
            key={biz._id}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
          >
            {biz.photos && biz.photos.length > 0 && (
              <img
                src={biz.photos[0]}
                alt={biz.name}
                className="w-full h-40 object-cover rounded mb-2"
              />
            )}
            <h2 className="text-lg font-bold">{biz.name}</h2>
            <p className="text-sm text-gray-600">
              {biz.description.slice(0, 60)}...
            </p>
            <p className="text-sm mt-2 text-blue-600">
              {biz.address?.city?.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Feature;
