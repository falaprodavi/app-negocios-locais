import React from "react";
import { FaWhatsapp, FaInstagram, FaHeart, FaShareAlt } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Link } from "react-router-dom";

const Card = ({ business, loading = false }) => {
  const cleanPhoneNumber = (whatsapp) => {
    return whatsapp.replace(/\D/g, ""); // Remove tudo que não é dígito
  };

  if (loading) {
    return (
      <div className="bg-white rounded shadow">
        <header className="p-4">
          <h3 className="text-lg font-bold">
            <Skeleton width={180} />
          </h3>
          <p className="text-xs text-gray-400 uppercase">
            <Skeleton width={120} />
          </p>
        </header>

        <section>
          <Skeleton height={192} className="w-full" />
          <p className="text-sm text-gray-600 p-4">
            <Skeleton count={2} />
          </p>
        </section>

        <footer className="p-4 flex justify-between items-center">
          <Skeleton width={80} height={20} />

          <div className="flex space-x-3">
            <Skeleton circle width={24} height={24} />
            <Skeleton circle width={24} height={24} />
            <Skeleton circle width={24} height={24} />
            <Skeleton circle width={24} height={24} />
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="bg-white rounded shadow">
      <header className="p-4">
        <h3 className="text-lg font-bold">{business.name}</h3>
        <p className="text-[10px] text-gray-400 uppercase">
          <span className="font-bold text-[#042f4a]">
            {business.category?.name || "Categoria"} -{" "}
          </span>
          {business.address?.neighborhood?.name}, {business.address?.city?.name}
        </p>
      </header>

      <section>
        {business.photos?.[0] && (
          <Link to={`/business/${business.slug}`}>
            <div className="relative overflow-hidden group">
              <img
                alt={business.name}
                src={business.photos[0]}
                className="w-full h-64 object-cover group-hover:scale-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
          </Link>
        )}
        <p className="text-sm text-gray-600 p-4">
          {business.description?.slice(0, 100)}...
        </p>
      </section>

      <footer className="p-4 flex justify-between items-center">
        <Link
          to={`/business/${business.slug}`}
          className="uppercase font-bold text-sm text-[#042f4a] hover:underline"
        >
          VER MAIS
        </Link>

        <div className="flex space-x-3">
          {business.phone && (
            <a
              href={`https://api.whatsapp.com/send/?phone=55${cleanPhoneNumber(
                business.whatsapp
              )}&text=Encontrei+sua+empresa+no+Guia+Do+Vale&type=phone_number&app_absent=0`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-green-500 text-2xl" />
            </a>
          )}

          {business.social?.instagram && (
            <a
              href={`https://instagram.com/${business.social.instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram className="text-pink-600 text-2xl" />
            </a>
          )}

          <button aria-label="Favoritar">
            <FaHeart className="text-red-500 text-2xl" />
          </button>

          <button aria-label="Compartilhar">
            <FaShareAlt className="text-gray-600 text-2xl" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Card;
