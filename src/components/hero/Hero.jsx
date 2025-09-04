import Carousel from "./Carousel";
import SearchBar from "./SearchBar";
import ScrollCue from "./ScrollCue";
import logoImage from "../../assets/logo/dg_transparente.png";


export default function Hero({
    images,
    intervalMs = 5000,
    title = "Descubra as melhores comidas da sua região",
    onSearch,
}) {
    return (
        <header
            className="relative h-[85vh] flex items-center justify-center text-center overflow-hidden isolate bg-white"
            aria-label="Herói com carrossel de imagens ao fundo"
        >
            {/* Carrossel de fundo */}
            <Carousel images={images} intervalMs={intervalMs} />


            {/* Overlay escuro */}
            <div className="absolute inset-0 bg-black/35 -z-0" aria-hidden />


            {/* Conteúdo */}
            <div className="relative z-10 w-[min(640px,92vw)] px-4 text-white">
                <div className="mb-4 flex justify-center"><img src={logoImage} alt="Logo" className="w-20 h-20" /></div>
                <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow">
                    {title}
                </h1>
                <div className="mt-5">
                    <SearchBar
                    placeholder="Busque a loja filiada..."
                    onSearch={onSearch || (() => {})}
                    />
                </div>
            </div>

            {/* Indicador de rolagem */}
            <ScrollCue className="absolute left-1/2 -translate-x-1/2 bottom-5 text-white" />
        </header>
    );
}