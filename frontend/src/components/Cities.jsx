import React from "react";
import { assets } from "../assets/assets";
import Title from "./Title";
import City from "./City";

const Cities = () => {
  return (
    <div className="flex flex-col items-center px-6 md:px-16 lg:px-24 xl:px-32 mb-12">
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <Title
          align="left"
          title="Cidades"
          subTitle="Temos novidades nessas cidades especiais! Confira e encontre os melhores estabelecimentos do Vale do Paraíba!"
        />
        <button className="group flex items-center font-medium">
          Ver cidades
          <img
            src={assets.arrowIcon}
            alt="icon"
            className="group-hover:translate-x-1 transition-transform"
          />
        </button>
      </div>
      <div className="flex flex-col md:flex-row items-center justify-between w-full">
        <City />
      </div>
    </div>
  );
};

export default Cities;
