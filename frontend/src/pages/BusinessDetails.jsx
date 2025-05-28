import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BusinessService from "../api/services/business";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGlobe,
} from "react-icons/fa";
import useScrollToTop from "../hooks/useScrollToTop";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import FavoriteButton from "../components/FavoriteButton";

// Corrige o caminho dos ícones para funcionar com Vite
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
});

const BusinessDetails = () => {
  const { slug } = useParams(); // usando slug
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useScrollToTop();

  const cleanPhoneNumber = (whatsapp) => whatsapp.replace(/\D/g, "");

  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);

  useEffect(() => {
    if (business) {
      // Atualiza o título da página
      document.title = `${business.name} - O Vale Online`;

      // Atualiza ou cria a meta description
      let metaDescription = document.querySelector('meta[name="description"]');

      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }

      metaDescription.content =
        business.description || `Conheça ${business.name}`;
    }
  }, [business]);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await BusinessService.getBySlug(slug);
        setBusiness(response.data);
      } catch (error) {
        console.error("Error:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [slug, navigate]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (!business)
    return (
      <div className="text-center py-10">Estabelecimento não encontrado</div>
    );

  return (
    <div className="w-full mt-14 px-4 md:px-16 lg:px-24 xl:px-32 md:mt-24 py-8">
      {/* Galeria Elegante - Versão Responsiva */}
      {business.photos.length > 0 && (
        <div className="mb-8">
          {/* Layout para desktop */}
          <div className="hidden md:block relative w-full h-96">
            <div className="absolute inset-0 flex gap-2">
              {/* Foto principal */}
              {business.photos[0] && (
                <div className="h-full w-full rounded-lg overflow-hidden flex-1 min-w-[50%]">
                  <img
                    src={business.photos[0]}
                    alt={`${business.name} 1`}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105 "
                  />
                </div>
              )}

              {/* Fotos secundárias */}
              <div className="flex-1 flex flex-col gap-2 min-w-[25%]">
                <div className="flex gap-2 h-1/2">
                  {[1, 2].map(
                    (index) =>
                      business.photos[index] && (
                        <div
                          key={index}
                          className="flex-1 rounded-lg overflow-hidden"
                        >
                          <img
                            src={business.photos[index]}
                            alt={`${business.name} ${index + 1}`}
                            className="w-full h-full object-cover transition-all duration-500 hover:scale-105 "
                          />
                        </div>
                      )
                  )}
                </div>
                <div className="flex gap-2 h-1/2">
                  {[3, 4].map(
                    (index) =>
                      business.photos[index] && (
                        <div
                          key={index}
                          className="flex-1 rounded-lg overflow-hidden"
                        >
                          <img
                            src={business.photos[index]}
                            alt={`${business.name} ${index + 1}`}
                            className="w-full h-full object-cover transition-all duration-500 hover:scale-105 "
                          />
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Fotos adicionais */}
              {business.photos.length > 5 && (
                <div
                  className="flex-1 flex flex-col gap-2 min-w-[25%] cursor-pointer"
                  onClick={() => setIsGalleryExpanded(true)}
                >
                  <div className="h-full rounded-lg overflow-hidden relative">
                    <img
                      src={business.photos[5]}
                      alt={`${business.name} 6`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-20 transition-all">
                      <span className="text-white text-xl font-medium">
                        +{business.photos.length - 5}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Layout para mobile */}
          <div className="md:hidden flex gap-2 h-48">
            {/* Coluna principal (60% width) */}
            {business.photos[0] && (
              <div className="w-3/5 h-full rounded-lg overflow-hidden">
                <img
                  src={business.photos[0]}
                  alt={`${business.name} 1`}
                  className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
                  onClick={() => setIsGalleryExpanded(true)}
                />
              </div>
            )}

            {/* Coluna secundária (40% width) */}
            <div className="w-2/5 flex flex-col gap-2 h-full">
              {business.photos[1] && (
                <div className="h-1/2 rounded-lg overflow-hidden">
                  <img
                    src={business.photos[1]}
                    alt={`${business.name} 2`}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
                    onClick={() => setIsGalleryExpanded(true)}
                  />
                </div>
              )}

              {business.photos[2] && (
                <div className="h-1/2 rounded-lg overflow-hidden relative">
                  <img
                    src={business.photos[2]}
                    alt={`${business.name} 3`}
                    className="w-full h-full object-cover"
                  />
                  {business.photos.length > 3 && (
                    <div
                      className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-20 transition-all cursor-pointer"
                      onClick={() => setIsGalleryExpanded(true)}
                    >
                      <span className="text-white text-sm font-medium">
                        +{business.photos.length - 3}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Contador de fotos (mobile e desktop) */}
          <div className="text-sm text-gray-500 mt-2 text-center">
            {business.photos.length}{" "}
            {business.photos.length === 1 ? "foto" : "fotos"}
          </div>
        </div>
      )}

      {/* Modal/Lightbox Responsivo */}
      {isGalleryExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-bold">
              Galeria de Fotos ({business.photos.length})
            </h2>
            <button
              onClick={() => setIsGalleryExpanded(false)}
              className="text-white text-2xl hover:text-gray-300"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            {/* 1 coluna no mobile, 2 em tablets, 3 em desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {business.photos.map((photo, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`${business.name} ${index + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Lightbox/Modal */}
      {isGalleryExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-bold">
              Galeria de Fotos ({business.photos.length})
            </h2>
            <button
              onClick={() => setIsGalleryExpanded(false)}
              className="text-white text-2xl hover:text-gray-300"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {business.photos.map((photo, index) => (
                <div key={index} className="rounded-lg overflow-hidden">
                  <img
                    src={photo}
                    alt={`${business.name} ${index + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Esquerda */}
        <div className="lg:col-span-2">
          {/* Categoria e Subcategoria */}
          <div className="flex items-center space-x-2 mb-2">
            {/* Botão de Favorito */}

            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {business.category?.name}{" "}
            </span>
            {business.subCategory && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {business.subCategory?.name}
              </span>
            )}
          </div>

          {/* Nome */}

          <div className="flex items-center justify-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
            </div>
            <div className="pb-3">
              <FavoriteButton businessId={business._id} />
            </div>
          </div>

          {/* Endereço */}
          <div className="flex items-center text-gray-600 mb-6">
            <span>
              {business.address?.neighborhood?.name ||
                business.address?.neighborhood}
            </span>
            <span className="mx-2">•</span>
            <span>
              {business.address?.city?.name || business.address?.city}
            </span>
          </div>

          {/* Descrição */}
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700">{business.description}</p>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className="space-y-6">
          {/* Mapa */}
          <div className="bg-gray-100 rounded-lg p-4 h-80">
            <h3 className="font-semibold mb-2">Localização</h3>
            {business.lat && business.long ? (
              <div className="h-64 bg-gray-200 rounded">
                <MapContainer
                  center={[parseFloat(business.lat), parseFloat(business.long)]}
                  zoom={15}
                  style={{
                    height: "100%",
                    width: "100%",
                    borderRadius: "0.5rem",
                  }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker
                    position={[
                      parseFloat(business.lat),
                      parseFloat(business.long),
                    ]}
                  >
                    <Popup>{business.name}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            ) : (
              <div className="h-64 bg-gray-200 rounded flex flex-col items-center justify-center text-center p-4">
                <p className="text-gray-500 mb-2">Localização não disponível</p>
                <p className="text-sm text-gray-400">
                  Este estabelecimento ainda não tem coordenadas geográficas
                  cadastradas
                </p>
              </div>
            )}
          </div>

          {/* Contato / Redes Sociais */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Contato</h3>

            {business.whatsapp && (
              <a
                href={`https://api.whatsapp.com/send/?phone=55${cleanPhoneNumber(
                  business.whatsapp
                )}&text=Encontrei+sua+empresa+no+Guia+Do+Vale&type=phone_number&app_absent=0`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 mb-3"
              >
                <FaWhatsapp size={20} />
                <span>WhatsApp</span>
              </a>
            )}

            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-pink-600 mb-3"
              >
                <FaInstagram size={20} />
                <span>Instagram</span>
              </a>
            )}

            {business.facebook && (
              <a
                href={`https://facebook.com/${business.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 mb-3"
              >
                <FaFacebook size={20} />
                <span>Facebook</span>
              </a>
            )}

            {business.linkedin && (
              <a
                href={business.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-700 mb-3"
              >
                <FaGlobe size={20} />
                <span>Site Oficial</span>
              </a>
            )}

            {business.website && (
              <a
                href={business.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-gray-700"
              >
                <FaGlobe size={20} />
                <span>Site Oficial</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetails;
