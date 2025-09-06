import Hero from "../components/hero/Hero";
import Highlights from "../components/highlightsStores/Highlights";

const IMAGES = [
    // Imagens ilustrativas públicas (picsum)
    "src/components/hero/assets/pexels-borbely-arpad-160125124-10790638.jpg",
    "src/components/hero/assets/pexels-caricatte-29250659.jpg",
    "src/components/hero/assets/pexels-goumbik-1352296.jpg",
    "src/components/hero/assets/pexels-renestrgar-10406184.jpg",
];


export default function SerachStore() {
    return (
    <main className="bg-white">
        <Hero images={IMAGES} intervalMs={5000} onSearch={(q) => console.log("buscar:", q)} />
        {/* Faixa branca visível abaixo */}
        <section className="mx-auto max-w-4xl text-center pb-20">
            <h2 className="mt-4 text-3xl md:text-5xl font-extrabold leading-tight">
                <span className="bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent drop-shadow">
                    Descubra nossos destaques
                </span>
            </h2>
      
            <p className="mt-3 text-gray-600 max-sm:mb-5 mb-2">
                Lojas selecionadas com base em avaliação, popularidade e categoria.
            </p>
            <Highlights />
        </section>
    </main>
);
}