import React, { useEffect } from "react";
import useScrollToTop from "../hooks/useScrollToTop";

const Privacy = () => {
  useScrollToTop();

  useEffect(() => {
    document.title = "O Vale Online - Política de Privacidade";

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.name = "description";
      document.head.appendChild(metaDescription);
    }

    metaDescription.content =
      "Confira nossa política de privacidade e veja como protegemos seus dados no maior portal regional do Vale do Paraíba.";
  }, []);

  return (
    <div className="container mx-auto px-4 py-12 mt-16 md:mt-24">
      <div className="bg-white rounded-2xl shadow-md overflow-hidden md:flex md:items-start md:space-x-8">
        {/* Imagem ilustrativa */}
        <div className="w-full md:w-1/2">
          <img
            src="https://res.cloudinary.com/dgqhiieda/image/upload/f_webp/q_auto/v1748545901/vale_assets/guiadovale_oxs8pp.png"
            alt="Política de Privacidade"
            className="w-full h-auto max-h-[1200px] object-contain md:object-cover md:h-full"
          />
        </div>

        {/* Texto */}
        <div className="p-8 md:w-1/2">
          <h1 className="text-3xl font-bold text-[#042f4a] mb-4">
            Política de Privacidade
          </h1>

          <p className="text-gray-600 mb-4">
            Nós, do <strong>O Vale On-Line</strong>, respeitamos sua privacidade
            e estamos comprometidos em proteger os dados pessoais que você
            compartilha conosco. Esta política explica como seus dados são
            coletados, usados e protegidos.
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            1. Dados Coletados
          </h2>
          <p className="text-gray-600 mb-4">
            Coletamos dados como nome, nome da empresa, e-mail, WhatsApp, CNPJ,
            redes sociais, descrição do negócio, fotos e vídeos enviados para o
            cadastro no portal.
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            2. Finalidade
          </h2>
          <p className="text-gray-600 mb-4">
            Usamos esses dados para criar sua página no portal, entrar em
            contato com você e melhorar sua experiência no site.
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            3. Compartilhamento
          </h2>
          <p className="text-gray-600 mb-4">
            Não compartilhamos seus dados com terceiros, salvo exigência legal
            ou operacional (ex: servidores).
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            4. Cookies
          </h2>
          <p className="text-gray-600 mb-4">
            Utilizamos cookies para melhorar a navegação e personalizar sua
            experiência. Você pode desativá-los nas configurações do navegador.
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            5. Segurança
          </h2>
          <p className="text-gray-600 mb-4">
            Seus dados são armazenados em servidores seguros, com medidas de
            proteção adequadas.
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            6. Seus Direitos
          </h2>
          <p className="text-gray-600 mb-4">
            Conforme a LGPD, você pode acessar, corrigir ou solicitar a exclusão
            de seus dados a qualquer momento. Basta enviar e-mail para:{" "}
            <strong>contato@ovaleonline.com.br</strong>
          </p>

          <h2 className="text-xl font-semibold text-[#042f4a] mb-3 mt-6">
            7. Atualizações
          </h2>
          <p className="text-gray-600 mb-4">
            Esta política pode ser atualizada a qualquer momento. A versão mais
            recente estará sempre disponível em nosso site.
          </p>

          <p className="text-gray-600 text-sm mt-8">
            Última atualização: 24/06/2025
          </p>

          <p className="text-gray-600 text-sm mt-2">
            Para dúvidas, fale conosco:{" "}
            <strong>contato@ovaleonline.com.br</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
