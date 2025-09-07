import React from 'react';

export default function SearchBar({ }) {
    return (
        <section aria-labelledby="titulo-busca" className="mb-8 md:mb-10">
            <h1 id="titulo-busca" className="sr-only">Buscar lojas ou restaurantes</h1>
            <div className="flex  gap-3 sm:flex-row sm:items-start">
                <div className="relative flex-1">
                    <label htmlFor="campo-busca" className="sr-only">Buscar por loja ou restaurante</label>
                    <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        id="campo-busca"
                        type="search"
                        inputMode="search"
                        placeholder="Busque por loja, restaurante ou categoria…"
                        className="w-full rounded-xl border border-gray-300/70 bg-white/90 px-11 py-3 text-sm md:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/20"
                        aria-describedby="dica-busca"
 
                    />
                    <p id="dica-busca" className="mt-2 text-xs text-gray-500">Ex.: “pizzaria”, “sushi”, “mercearia”, “padaria do joão”.</p>
                </div>            
                <div>
                    <button
                        type="submit"
                        className="px-5 py-3  rounded-full transition-all duration-300 bg-orange-600 text-white font-semibold hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-orange-500/40"
                    >
                        Buscar
                    </button>

                </div>
            </div>
        </section>
        );
    }