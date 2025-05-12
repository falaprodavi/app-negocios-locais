import React from "react";

const Card = ({
  title = "Sem nome",
  description = "Sem descrição",
  category = "Sem categoria",
  imageUrl = "https://via.placeholder.com/400",
  address = "",
  phone = "",
}) => {
  return (
    <div>
      <div className="relative h-48 w-full">
        <span className="absolute top-2 left-2 bg-white/80 backdrop-blur-sm text-slate-600 text-xs px-2 py-1 rounded z-10">
          {category}
        </span>
        <img
          className="h-full w-full object-cover"
          src={imageUrl}
          alt={title}
          loading="lazy"
        />
      </div>

      <div className="p-4 flex-1">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 mb-2 line-clamp-2">{description}</p>
        {address && (
          <p className="text-xs text-gray-400 mb-1 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {address}
          </p>
        )}
      </div>

      <div className="p-4 border-t border-gray-100">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 text-sm"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            {phone}
          </a>
        )}
      </div>
    </div>
  );
};

export default Card;
