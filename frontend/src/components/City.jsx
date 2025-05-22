import React from "react";
import { Link } from "react-router-dom";
import useApi from "../hooks/useApi";
import CityService from "../api/services/city";
import { slugify } from "../utils/helpers"; // Adicione esta importação

const City = () => {
  const { data, loading, error } = useApi(CityService.getPopularCities);

  if (loading)
    return (
      <div className="">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="w-full min-w-[250px] bg-gray-200 rounded-lg h-64 animate-pulse"
          ></div>
        ))}
      </div>
    );

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {data.map((city) => (
        <Link
          key={city._id}
          to={`/explore?city=${slugify(city.name)}`}
          className="w-full min-w-[250px] relative block group"
        >
          <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group-hover:shadow-lg h-full flex flex-col">
            <div className="relative flex-grow">
              <span className="absolute top-2 left-2 bg-white/70 backdrop-blur-sm text-slate-600 font-light text-xs px-2 py-1 rounded z-10 group-hover:bg-opacity-90 transition-all">
                {city.businessCount} estabelecimentos
              </span>
              <div className="overflow-hidden rounded-t-md h-48">
                <img
                  src={city.image}
                  alt={city.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium text-lg text-gray-800">{city.name}</h3>
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 rounded-md pointer-events-none" />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default City;
