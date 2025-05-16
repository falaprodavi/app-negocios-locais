import React from "react";
import { FaWhatsapp, FaInstagram, FaHeart, FaShareAlt } from "react-icons/fa";

const Card = ({ business }) => {
  return (
    <div className="bg-white rounded shadow">
      <header className="p-4">
        <h3 className="text-lg font-bold">{business.name}</h3>
        <p className="text-xs text-gray-400 uppercase">
          <span>{business.category?.name || "Categoria"} - </span>
          {business.address?.neighborhood?.name}, {business.address?.city?.name}
        </p>
      </header>

      <section>
        {business.photos?.[0] && (
          <img
            alt={business.name}
            src={business.photos[0]}
            className="w-full h-48 object-cover"
          />
        )}
        <p className="text-sm text-gray-600 p-4">
          {business.description?.slice(0, 100)}...
        </p>
      </section>

      <footer className="p-4 flex justify-between items-center">
        <a
          href={`/business/${business._id}`}
          className="uppercase font-bold text-sm text-blue-700 hover:underline"
        >
          Ver mais
        </a>

        <div className="flex space-x-3">
          {/* WhatsApp - só mostra se tiver telefone */}
          {business.phone && (
            <a
              href={`https://wa.me/${business.phone}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp className="text-green-500 text-2xl" />
            </a>
          )}

          {/* Instagram - só mostra se tiver perfil */}
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

          {/* Ícone de favorito */}
          <button aria-label="Favoritar">
            <FaHeart className="text-red-500 text-2xl" />
          </button>

          {/* Ícone de compartilhar */}
          <button aria-label="Compartilhar">
            <FaShareAlt className="text-gray-600 text-2xl" />
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Card;
