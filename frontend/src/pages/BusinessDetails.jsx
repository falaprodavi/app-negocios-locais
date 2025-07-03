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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/leaflet/marker-icon.png",
  shadowUrl: "/leaflet/marker-shadow.png",
  iconRetinaUrl: "/leaflet/marker-icon-2x.png",
});

const BusinessDetails = () => {
  const { slug } = useParams();
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGalleryExpanded, setIsGalleryExpanded] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [relatedBusinesses, setRelatedBusinesses] = useState([]);
  const navigate = useNavigate();

  useScrollToTop();

  useEffect(() => {
    if (business) {
      // Título otimizado para SEO
      document.title = `${business.name} | ${
        business.category?.[0]?.name || "Negócio"
      } em ${business.address?.city?.name || ""} - O Vale On-Line`;

      // Meta description
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement("meta");
        metaDescription.name = "description";
        document.head.appendChild(metaDescription);
      }
      metaDescription.content =
        business.description ||
        `Conheça ${business.name}, ${
          business.category?.[0]?.name || "estabelecimento"
        } em ${business.address?.city?.name || ""}. ${
          business.address?.neighborhood?.name
            ? `Localizado no bairro ${business.address.neighborhood.name}.`
            : ""
        }`;

      // Meta keywords
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement("meta");
        metaKeywords.name = "keywords";
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.content = [
        business.name,
        business.category?.[0]?.name,
        ...(business.subCategory?.map((sc) => sc.name) || []),
        business.address?.city?.name,
        business.address?.neighborhood?.name,
        "O Vale On-Line",
      ]
        .filter(Boolean)
        .join(", ");

      // Open Graph Tags
      const setMetaTag = (property, content) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement("meta");
          tag.setAttribute("property", property);
          document.head.appendChild(tag);
        }
        tag.content = content;
      };

      setMetaTag(
        "og:title",
        `${business.name} | ${business.category?.[0]?.name || "Negócio"} em ${
          business.address?.city?.name || ""
        }`
      );
      setMetaTag(
        "og:description",
        business.description || `Conheça ${business.name} no O Vale On-Line`
      );
      setMetaTag(
        "og:image",
        business.photos?.[0]
          ? optimizeImage(business.photos[0], { width: 1200 })
          : ""
      );
      setMetaTag("og:url", window.location.href);
      setMetaTag("og:type", "business.business");

      // Twitter Card
      setMetaTag("twitter:card", "summary_large_image");
      setMetaTag(
        "twitter:title",
        `${business.name} | ${business.category?.[0]?.name || "Negócio"} em ${
          business.address?.city?.name || ""
        }`
      );
      setMetaTag(
        "twitter:description",
        business.description || `Conheça ${business.name} no O Vale On-Line`
      );
      setMetaTag(
        "twitter:image",
        business.photos?.[0]
          ? optimizeImage(business.photos[0], { width: 1200 })
          : ""
      );

      // Pré-carregar imagem principal
      if (business.photos?.[0]) {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = optimizeImage(business.photos[0], { width: 800 });
        document.head.appendChild(link);
      }
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

  const cleanPhoneNumber = (phone) => {
    return phone.replace(/\D/g, "");
  };

  const optimizeImage = (url, options = {}) => {
    if (!url || !url.includes("cloudinary.com")) return url;

    const {
      width,
      quality = 80,
      format = "auto",
      crop = false,
      gravity = "auto",
    } = options;

    const transformations = [];
    transformations.push(`f_${format}`, `q_${quality}`);
    if (width) transformations.push(`w_${width}`);
    if (crop) {
      transformations.push("c_fill");
      if (gravity) transformations.push(`g_${gravity}`);
    }
    transformations.push("fl_progressive", "dpr_auto", "e_sharpen:100");

    return url.replace("/upload/", `/upload/${transformations.join(",")}/`);
  };

  const generateSrcSet = (url, widths = [300, 600, 900, 1200]) => {
    return widths
      .map((width) => `${optimizeImage(url, { width })} ${width}w`)
      .join(", ");
  };

  const sanitizeHtmlContent = (html) => {
    return html?.replace(/<p>(&nbsp;|\s)*<\/p>/g, "").trim() || "";
  };

  const utmParams = `utm_source=ovaleonline&utm_medium=referral&utm_campaign=business_profile`;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="text-center py-10">Estabelecimento não encontrado</div>
    );
  }

  return (
    <div className="container mx-auto mt-14 px-4 sm:px-6 lg:px-8 md:mt-24 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-4">
        <ol className="flex flex-wrap gap-2 text-sm text-gray-600">
          <li>
            <a href="/" className="hover:text-blue-600">
              Home
            </a>
          </li>
          {business.category?.[0] && (
            <>
              <li>/</li>
              <li>
                {/* <a
                  href={`/categoria/${business.category[0].slug}`}
                  className="hover:text-blue-600"
                > */}
                {business.category[0].name}
                {/* </a>*/}
              </li>
            </>
          )}
          <li>/</li>
          <li aria-current="page" className="text-gray-900 font-medium">
            {business.name}
          </li>
        </ol>
      </nav>

      {/* Galeria de Imagens */}
      {business.photos?.length > 0 && (
        <div className="mb-8">
          {/* Desktop */}
          <div className="hidden md:block relative w-full h-96">
            <div className="absolute inset-0 flex gap-2">
              {/* Principal */}
              {business.photos[0] && (
                <div
                  className="h-full w-full rounded-lg overflow-hidden flex-1 min-w-[50%] cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(0);
                    setIsGalleryExpanded(true);
                  }}
                  aria-label="Ampliar imagem principal"
                >
                  <img
                    src={optimizeImage(business.photos[0], {
                      width: 800,
                      quality: 85,
                    })}
                    srcSet={generateSrcSet(business.photos[0])}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt={`${business.name} - ${
                      business.category?.[0]?.name || "estabelecimento"
                    } em ${business.address?.city?.name || ""}`}
                    className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                    loading="eager"
                  />
                </div>
              )}

              {/* Secundárias */}
              <div className="flex-1 flex flex-col gap-2 min-w-[25%]">
                <div className="flex gap-2 h-1/2">
                  {[1, 2].map(
                    (index) =>
                      business.photos[index] && (
                        <div
                          key={index}
                          className="flex-1 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setIsGalleryExpanded(true);
                          }}
                          aria-label={`Ampliar imagem ${index + 1}`}
                        >
                          <img
                            src={optimizeImage(business.photos[index], {
                              width: 400,
                              quality: 80,
                            })}
                            srcSet={generateSrcSet(business.photos[index], [
                              200,
                              400,
                              600,
                            ])}
                            sizes="(max-width: 768px) 100vw, 25vw"
                            alt={`${business.name} - ${
                              business.category?.[0]?.name || "estabelecimento"
                            } em ${business.address?.city?.name || ""}`}
                            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                            loading={index > 2 ? "lazy" : "eager"}
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
                          className="flex-1 rounded-lg overflow-hidden cursor-pointer"
                          onClick={() => {
                            setSelectedImageIndex(index);
                            setIsGalleryExpanded(true);
                          }}
                          aria-label={`Ampliar imagem ${index + 1}`}
                        >
                          <img
                            src={optimizeImage(business.photos[index], {
                              width: 400,
                              quality: 80,
                            })}
                            srcSet={generateSrcSet(business.photos[index], [
                              200,
                              400,
                              600,
                            ])}
                            sizes="(max-width: 768px) 100vw, 25vw"
                            alt={`${business.name} - ${
                              business.category?.[0]?.name || "estabelecimento"
                            } em ${business.address?.city?.name || ""}`}
                            className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
                            loading="lazy"
                          />
                        </div>
                      )
                  )}
                </div>
              </div>

              {/* Botão de expansão */}
              {business.photos.length > 5 && (
                <div
                  className="flex-1 flex flex-col gap-2 min-w-[25%] cursor-pointer"
                  onClick={() => {
                    setSelectedImageIndex(5);
                    setIsGalleryExpanded(true);
                  }}
                  aria-label="Ver mais fotos"
                >
                  <div className="h-full rounded-lg overflow-hidden relative">
                    <img
                      src={optimizeImage(business.photos[5], {
                        width: 400,
                        quality: 80,
                      })}
                      srcSet={generateSrcSet(business.photos[5], [
                        200,
                        400,
                        600,
                      ])}
                      sizes="(max-width: 768px) 100vw, 25vw"
                      alt={`${business.name} - ${
                        business.category?.[0]?.name || "estabelecimento"
                      } em ${business.address?.city?.name || ""}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
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

          {/* Mobile */}
          <div className="md:hidden flex gap-2 h-48">
            <div className="w-3/5 h-full rounded-lg overflow-hidden">
              <img
                src={optimizeImage(business.photos[0], {
                  width: 400,
                  quality: 85,
                })}
                srcSet={generateSrcSet(business.photos[0], [200, 400, 600])}
                sizes="(max-width: 768px) 60vw, 30vw"
                alt={`${business.name} - ${
                  business.category?.[0]?.name || "estabelecimento"
                } em ${business.address?.city?.name || ""}`}
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
                onClick={() => {
                  setSelectedImageIndex(0);
                  setIsGalleryExpanded(true);
                }}
                loading="eager"
              />
            </div>

            <div className="w-2/5 flex flex-col gap-2 h-full">
              {[1, 2].map(
                (index) =>
                  business.photos[index] && (
                    <div
                      key={index}
                      className="h-1/2 rounded-lg overflow-hidden relative"
                    >
                      <img
                        src={optimizeImage(business.photos[index], {
                          width: 200,
                          quality: 80,
                        })}
                        srcSet={generateSrcSet(business.photos[index], [
                          100,
                          200,
                          300,
                        ])}
                        sizes="(max-width: 768px) 40vw, 20vw"
                        alt={`${business.name} - ${
                          business.category?.[0]?.name || "estabelecimento"
                        } em ${business.address?.city?.name || ""}`}
                        className="w-full h-full object-cover transition-all duration-500 hover:scale-105 cursor-pointer"
                        onClick={() => {
                          setSelectedImageIndex(index);
                          setIsGalleryExpanded(true);
                        }}
                        loading="lazy"
                      />
                      {index === 1 && business.photos.length > 3 && (
                        <div
                          className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center hover:bg-opacity-20 transition-all cursor-pointer"
                          onClick={() => {
                            setSelectedImageIndex(2);
                            setIsGalleryExpanded(true);
                          }}
                          aria-label="Ver mais fotos"
                        >
                          <span className="text-white text-sm font-medium">
                            +{business.photos.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  )
              )}
            </div>
          </div>

          <div className="text-sm text-gray-500 mt-2 text-center">
            {business.photos.length}{" "}
            {business.photos.length === 1 ? "foto" : "fotos"}
          </div>
        </div>
      )}

      {/* Modal Expandido */}
      {isGalleryExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex flex-col p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-white text-xl font-bold">
              {business.name} - Foto {selectedImageIndex + 1} de{" "}
              {business.photos.length}
            </h2>
            <button
              onClick={() => setIsGalleryExpanded(false)}
              className="text-white text-2xl hover:text-gray-300"
              aria-label="Fechar galeria de imagens"
            >
              &times;
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center relative">
            {/* Imagem principal */}
            <div className="max-w-full max-h-[80vh] flex items-center justify-center">
              <img
                src={optimizeImage(business.photos[selectedImageIndex], {
                  quality: 90,
                })}
                alt={`${business.name} - ${
                  business.category?.[0]?.name || "estabelecimento"
                } em ${business.address?.city?.name || ""}`}
                className="max-w-full max-h-[80vh] object-contain"
                loading="eager"
              />
            </div>

            {/* Navegação */}
            {business.photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev === 0 ? business.photos.length - 1 : prev - 1
                    );
                  }}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  aria-label="Foto anterior"
                >
                  &larr;
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) =>
                      prev === business.photos.length - 1 ? 0 : prev + 1
                    );
                  }}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                  aria-label="Próxima foto"
                >
                  &rarr;
                </button>
              </>
            )}
          </div>

          {/* Miniaturas */}
          <div className="mt-4 overflow-x-auto">
            <div className="flex space-x-2 justify-center">
              {business.photos.map((photo, index) => (
                <div
                  key={index}
                  className={`w-16 h-16 rounded overflow-hidden cursor-pointer border-2 ${
                    index === selectedImageIndex
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedImageIndex(index)}
                  aria-label={`Ver foto ${index + 1}`}
                >
                  <img
                    src={optimizeImage(photo, {
                      width: 80,
                      height: 80,
                      crop: true,
                      quality: 60,
                    })}
                    alt={`Miniatura ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
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
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Mostrar todas as categorias */}
              {business.category?.map((cat, index) => (
                <span
                  key={`cat-${index}`}
                  className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full"
                >
                  {cat?.name}
                </span>
              ))}

              {/* Mostrar todas as subcategorias */}
              {business.subCategory?.map((subCat, index) => (
                <span
                  key={`subcat-${index}`}
                  className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full"
                >
                  {subCat?.name}
                </span>
              ))}
            </div>
          </div>

          {/* Nome */}
          <div className="flex items-center justify-start">
            <div>
              <h1 className="text-3xl font-bold mb-4">{business.name}</h1>
            </div>
            <div className="pb-3 ml-4 mt-1">
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
          <article className="prose max-w-none mb-8">
            <div
              className="prose"
              dangerouslySetInnerHTML={{
                __html: sanitizeHtmlContent(business.description),
              }}
            />
          </article>

          {/* Vídeo Embed - Se existir URL de vídeo */}
          {business.video && (
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">
                Vídeo - {business.name}
              </h2>
              <div className="aspect-w-16 aspect-h-9 w-full overflow-hidden rounded-lg shadow-lg">
                <iframe
                  className="w-full h-96 md:h-[500px]"
                  src={business.video}
                  title={`Vídeo do estabelecimento ${business.name}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
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

          {/* Endereço */}
          <div className="bg-white rounded-lg shadow p-4 text-gray-700">
            {business.address.street}, {business.address.number},{" "}
            {business.address?.neighborhood?.name},{" "}
            {business.address?.city?.name} - Brasil
          </div>

          {/* Contato / Redes Sociais */}
          <div className="bg-white rounded-lg shadow p-4">
            <h3 className="font-semibold mb-3">Contato</h3>

            {business.whatsapp && (
              <a
                href={`https://api.whatsapp.com/send/?phone=55${cleanPhoneNumber(
                  business.whatsapp
                )}&text=Oi!+Encontrei+sua+empresa+no+O+VALE+ONLINE.+Gostaria+de+mais+detalhes&type=phone_number&app_absent=0&${utmParams}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-green-600 mb-3 hover:text-green-800"
                aria-label="Contato via WhatsApp"
              >
                <FaWhatsapp size={20} />
                <span>WhatsApp</span>
              </a>
            )}

            {business.instagram && (
              <a
                href={`https://instagram.com/${business.instagram}?${utmParams}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-pink-600 mb-3 hover:text-pink-800"
                aria-label="Perfil no Instagram"
              >
                <FaInstagram size={20} />
                <span>Instagram</span>
              </a>
            )}

            {business.facebook && (
              <a
                href={`https://facebook.com/${business.facebook}?${utmParams}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-600 mb-3 hover:text-blue-800"
                aria-label="Página no Facebook"
              >
                <FaFacebook size={20} />
                <span>Facebook</span>
              </a>
            )}

            {business.linkedin && (
              <a
                href={`${business.linkedin}?${utmParams}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-700 mb-3 hover:text-blue-900"
                aria-label="Perfil no LinkedIn"
              >
                <FaLinkedin size={20} />
                <span>LinkedIn</span>
              </a>
            )}

            {business.site && (
              <a
                href={`${business.site}?${utmParams}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-blue-700 mb-3 hover:text-blue-900"
                aria-label="Site oficial"
              >
                <FaGlobe size={20} />
                <span>Site Oficial</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Schema.org Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: business.name,
          image: business.photos?.[0]
            ? optimizeImage(business.photos[0], { width: 1200 })
            : undefined,
          description:
            business.description ||
            `Conheça ${business.name} no O Vale On-Line`,
          address: {
            "@type": "PostalAddress",
            streetAddress: `${business.address.street}, ${business.address.number}`,
            addressLocality: business.address?.city?.name,
            addressRegion: "SP",
            postalCode: business.address.zipCode,
            addressCountry: "BR",
          },
          geo:
            business.lat && business.long
              ? {
                  "@type": "GeoCoordinates",
                  latitude: business.lat,
                  longitude: business.long,
                }
              : undefined,
          telephone: business.phone,
          sameAs: [
            business.instagram
              ? `https://instagram.com/${business.instagram}`
              : undefined,
            business.facebook
              ? `https://facebook.com/${business.facebook}`
              : undefined,
            business.linkedin,
            business.site,
          ].filter(Boolean),
        })}
      </script>

      {/* Negócios Relacionados */}
      {relatedBusinesses.length > 0 && (
        <section className="mt-12" aria-labelledby="related-businesses-heading">
          <h2
            id="related-businesses-heading"
            className="text-2xl font-bold mb-6"
          >
            Outros {business.category?.[0]?.name || "estabelecimentos"} em{" "}
            {business.address?.city?.name}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {relatedBusinesses.map((relatedBusiness) => (
              <div
                key={relatedBusiness._id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
                <a href={`/empresa/${relatedBusiness.slug}`} className="block">
                  {relatedBusiness.photos?.[0] && (
                    <img
                      src={optimizeImage(relatedBusiness.photos[0], {
                        width: 400,
                        height: 200,
                        crop: true,
                      })}
                      alt={relatedBusiness.name}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {relatedBusiness.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {relatedBusiness.address?.neighborhood?.name ||
                        relatedBusiness.address?.neighborhood}
                    </p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BusinessDetails;
