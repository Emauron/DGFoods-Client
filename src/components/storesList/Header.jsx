import React, { useEffect, useState } from "react";
import logoImage from "../../assets/logo/logo com texto.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import api from "../../services/api/api";
import { useNavigate } from "react-router-dom";

export default function Header({ id_city }) {
    const [location, setLocation] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const getLocation = async () => {
            try {
                const response = await api.get(`/api/city/info/${id_city}`);
                if (response.data.name != null) {
                    setLocation(response.data.name + " - " + response.data.uf);
                } else {
                    navigate("/");
                }
            } catch (error) {
                console.error(error);
            }
        };
        getLocation();
    }, [id_city]);

    return (
        <header
            role="banner"
            className="w-full border-b border-gray-200/70 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60"
        >
            <div className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6">
                {/* Grid responsivo: 2 colunas no mobile, 3 colunas em md+ */}
                <div className="grid grid-cols-2 md:grid-cols-3 items-center gap-3 py-3 md:py-4 lg:py-5">
                    {/* Logo + Localização juntos */}
                    <div className="col-span-1 flex items-center gap-3 min-w-0">
                        <img
                            src={logoImage}
                            alt="Logomarca"
                            className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto select-none"
                            draggable={false}
                        />
                        <div className="hidden sm:flex items-center gap-2">
                            <FontAwesomeIcon
                                icon={faLocationDot}
                                className="text-lg sm:text-xl md:text-2xl shrink-0"
                                aria-hidden="true"
                            />
                            <p className="flex flex-col text-xs sm:text-sm md:text-base leading-none text-gray-800 whitespace-nowrap">
                                <span className="font-semibold">Você está em</span>
                                <span style={{ marginTop: -8 }}>{location}</span>
                            </p>
                        </div>
                    </div>

                    {/* Espaço vazio no centro para md+ (para balancear grid) */}
                    <div className="hidden md:block" />

                    {/* CTA */}
                    <div className="col-span-1 flex justify-end">
                        <div className="flex items-center gap-2">
                            {/* Botão compacto para telas pequenas */}
                            <a
                                href="#quero-ser-parceiro"
                                className="inline-flex md:hidden items-center justify-center rounded-lg bg-gray-900 px-3 py-2 text-xs font-medium text-white shadow-sm active:scale-[.99]"
                                aria-label="Junte-se a nós"
                            >
                                É lojista?
                            </a>

                            {/* Botão completo para md+ */}
                            <a
                                href="#quero-ser-parceiro"
                                className="hidden md:inline-flex items-center justify-center rounded-xl bg-gray-900 px-4 md:px-5 lg:px-7 py-2 md:py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/40 active:scale-[.99]"
                            >
                                Possui uma loja?
                                <span className="hidden sm:inline">&nbsp;Junte-se a nós!</span>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Faixa de localização alternativa só no mobile (mostra abaixo do logo) */}
                <div className="sm:hidden pb-3">
                    <div className="flex items-center gap-2 text-gray-800">
                        <FontAwesomeIcon icon={faLocationDot} className="text-base" aria-hidden="true" />
                        <p className="flex text-sm leading-none">
                            <span className="font-medium mr-1">Você está em </span>
                            {location}
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}
