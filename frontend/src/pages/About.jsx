import React from "react";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 mt-16 md:mt-24">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden md:flex md:items-center md:space-x-8">
        {/* Imagem ilustrativa */}
        <div className="md:w-1/2">
          <img
            src="https://res.cloudinary.com/dgqhiieda/image/upload/f_webp/q_auto/v1748545901/vale_assets/guiadovale_oxs8pp.png
"
            alt="Quem Somos"
            className="w-full h-64 object-cover md:h-full"
          />
        </div>

        {/* Texto */}
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-[#042f4a] mb-4">Quem Somos</h1>
          <p className="text-gray-600 mb-4">
            Somos uma plataforma especializada na divulgação dos melhores
            estabelecimentos do{" "}
            <span className="font-semibold text-[#042f4a]">
              Vale do Paraíba
            </span>{" "}
            . Nosso sistema de busca permite que você encontre empresas de forma
            rápida e intuitiva, utilizando filtros como cidade, bairro,
            categoria e subcategoria.
          </p>
          <p className="text-gray-600 mb-4">
            Não vemos iniciativas semelhantes como concorrentes, mas como{" "}
            aliadosque, juntos, fortalecem o ecossistema local, facilitando o
            acesso à informação e promovendo os negócios da nossa região.
          </p>
          <p className="text-gray-600 mb-4">
            Prezamos pela{" "}
            <span className="font-semibold text-[#042f4a]">
              experiência do usuário
            </span>
            , oferecendo uma interface simples, eficiente e acessível.
            Garantimos visibilidade igualitária para todos os estabelecimentos,
            sem distinções, e mantemos um compromisso firme com a{" "}
            <span className="font-semibold text-[#042f4a]">
              qualidade e a precisão das informações
            </span>
            .
          </p>
          <p className="text-gray-600">
            Todos os nossos planos são iguais, promovendo transparência e
            equidade entre os negócios cadastrados. Nosso objetivo é impulsionar
            o desenvolvimento econômico do Vale do Paraíba através de tecnologia
            e colaboração.
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
