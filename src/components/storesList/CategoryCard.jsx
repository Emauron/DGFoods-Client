export default function CategoryCard({ name }) {
    // selected ? "ring-2 ring-gray-900/20" : ""
    return (
        <li className="w-40">
            <button
                data-categoria={name}
                className={`group w-full overflow-hidden rounded-xl border border-gray-200/80 bg-white text-left shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-gray-900/20
                `}
            >
                <div className="relative aspect-[4/3] bg-gray-100">
                    <div className="absolute inset-0 grid place-items-center text-gray-400">Imagem</div>
                    {/* Substitua por <img src="/caminho.jpg" alt="" className="h-full w-full object-cover" /> */}
                </div>
                <div className="p-3">
                    <p className=" text-xs text-gray-600 font-extralight text-center group-hover:underline">{name}</p>
                </div>
            </button>
        </li>
    );
}