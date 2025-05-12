import React from "react";
import SearchForm from "./SearchForm";

const Hero = () => {
  const cities = [
    "São José dos Campos",
    "Taubaté",
    "Jacareí",
    "Pindamonhangaba",
    "Guaratinguetá",
    "Lorena",
    "Cruzeiro",
    "Caçapava",
    "Campos do Jordão",
    "Aparecida",
  ];

  return (
    <div className="flex flex-col items-start justify-center px-6 md:px-16 lg:px-24 xl:px-32 text-white bg-[url('/src/assets/heroImage.png')] bg-cover bg-center h-[85vh]">
      <span className="text-xs md:text-sm bg-blue-500/50 px-3.5 py-1 rounded-full mt-20">
        Os melhores estabelecimentos do Vale do Paraíba
      </span>

      <h1 className="text-4xl md:text-5xl md:leading-[56px] font-bold max-w-xl mt-4">
        Encontre tudo que deseja no Vale
      </h1>

      <p className="max-w-xl mt-2 text-sm md:text-base">
        {cities.join(", ")} e muito mais
      </p>

      <SearchForm />
    </div>
  );
};

export default Hero;
