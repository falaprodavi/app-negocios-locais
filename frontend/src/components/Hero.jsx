import React from "react";
import { useSearch } from "../hooks/useSearch";
import HorizontalSearchForm from "../components/HorizontalSearchForm";

const Hero = () => {
  const city = [
    "São José dos Campos",
    "Taubaté",
    "Jacareí",
    "Pinda",
    // ... outras cidades
  ];

  const {
    searchParams,
    cities,
    neighborhoods,
    categories,
    subCategories,
    isLoading,
    handleSearchChange,
    handleSearchSubmit,
  } = useSearch();

  return (
    <div className="relative flex flex-col items-center justify-center px-4 md:px-8 py-16 text-white bg-[url('/src/assets/heroImage.png')] bg-cover bg-center min-h-[85vh]">
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 w-full max-w-6xl text-center">
        <span className="inline-block text-xs md:text-sm bg-[#042f4a] px-3.5 py-1 rounded-full mb-4">
          Os melhores estabelecimentos do Vale do Paraíba
        </span>

        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          Encontre tudo que deseja no Vale
        </h1>

        <p className="text-sm md:text-base mb-8 max-w-2xl mx-auto">
          {city.join(", ")} e muito mais
        </p>

        <div className="w-full flex justify-center">
          <HorizontalSearchForm
            searchParams={searchParams}
            cities={cities}
            neighborhoods={neighborhoods}
            categories={categories}
            subCategories={subCategories}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
