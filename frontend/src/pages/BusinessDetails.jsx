import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import BusinessService from "../api/services/business";
import {
  FaWhatsapp,
  FaInstagram,
  FaFacebook,
  FaLinkedin,
  FaGlobe,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import useScrollToTop from "../hooks/useScrollToTop";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const BusinessDetails = () => {
  const { id } = useParams();
  const { slug } = useParams(); // Agora usando slug em vez de id
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useScrollToTop();

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        const response = await BusinessService.getBySlug(slug);
        setBusiness(response.data);
        setIsFavorite(false); // Implementar lógica real depois
      } catch (error) {
        console.error("Error:", error);
        navigate("/404");
      } finally {
        setLoading(false);
      }
    };

    fetchBusiness();
  }, [slug, navigate]);

  const handleFavoriteClick = () => {
    // Lógica para adicionar/remover dos favoritos será implementada depois
    setIsFavorite(!isFavorite);
    console.log(
      `Estabelecimento ${isFavorite ? "removido" : "adicionado"} aos favoritos`
    );
  };

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
    <div className="w-full px-4 md:px-16 lg:px-24 xl:px-32 mt-24 py-8">
      {/* Carrossel de Fotos */}
      <div className="relative mb-8 rounded-lg overflow-hidden">
        {/* Botão de Favoritos */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-4 right-4 z-10 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors"
          aria-label={
            isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"
          }
        >
          {isFavorite ? (
            <FaHeart className="text-red-500 text-xl" />
          ) : (
            <FaRegHeart className="text-gray-600 text-xl" />
          )}
        </button>

        <Carousel
          showArrows={true}
          showStatus={true}
          showIndicators={true}
          showThumbs={business.photos.length > 1}
          infiniteLoop={true}
          selectedItem={currentSlide}
          onChange={(index) => setCurrentSlide(index)}
          className="rounded-lg"
        >
          {business.photos.map((photo, index) => (
            <div key={index} className="h-96 md:h-[32rem]">
              <img
                src={photo}
                alt={`${business.name} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Conteúdo Principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna da Esquerda */}
        <div className="lg:col-span-2">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {business.category?.name}
            </span>
            {business.subCategory && (
              <span className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                {business.subCategory?.name}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold mb-4">{business.name}</h1>

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

          <div className="prose max-w-none mb-8">
            <p className="text-gray-700">{business.description}</p>
          </div>
        </div>

        {/* Coluna da Direita */}
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

          {/* Redes Sociais */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Contato</h3>

            {business.whatsapp && (
              <a
                href={`https://wa.me/${business.whatsapp}`}
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
                href={`https://linkedin.com/${business.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-700 mb-3"
              >
                <FaLinkedin size={20} />
                <span>LinkedIn</span>
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
