import React, { useEffect } from "react";
import Hero from "../components/Hero";
import Feature from "../components/Feature";
import Cities from "../components/Cities";
import CTA from "../components/CTA";
import useScrollToTop from "../hooks/useScrollToTop";

const Home = () => {
  useScrollToTop();

  useEffect(() => {
    document.title =
      "Guia Completo do Vale do Paraíba - Melhores Estabelecimentos e Serviços | O Vale Online";

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }
    metaDescription.content =
      "Explore o melhor do Vale do Paraíba! Guia completo com restaurantes, lojas, serviços e atrações turísticas em toda a região do Vale do Paraíba.";

    // Adicionando meta tags adicionais
    const metaKeywords = document.createElement("meta");
    metaKeywords.name = "keywords";
    metaKeywords.content =
      "Vale do Paraíba, guia Vale do Paraíba, turismo Vale do Paraíba, restaurantes Vale do Paraíba, cidades Vale do Paraíba";
    document.head.appendChild(metaKeywords);

    // Open Graph para redes sociais
    const ogTitle = document.createElement("meta");
    ogTitle.property = "og:title";
    ogTitle.content = "Guia Completo do Vale do Paraíba | O Vale Online";
    document.head.appendChild(ogTitle);

    const ogDescription = document.createElement("meta");
    ogDescription.property = "og:description";
    ogDescription.content =
      "Descubra tudo o que o Vale do Paraíba tem para oferecer - do turismo à gastronomia!";
    document.head.appendChild(ogDescription);
  }, []);

  return (
    <>
      <Hero />
      <Feature />
      <Cities />
      <CTA />
    </>
  );
};

export default Home;
