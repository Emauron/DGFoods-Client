import { useState } from "react";


export default function SearchBar({ placeholder, onSearch }) {
const [value, setValue] = useState("");


return (
<form
    onSubmit={(e) => {
        e.preventDefault();
        onSearch && onSearch(value.trim());
        }}
        role="search"
        aria-label="Buscar lojas filiadas"
        className="flex gap-2 justify-center"
    >
    <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="flex-1 max-w-[420px] px-5 py-3 rounded-full border border-white/40 bg-white/20 text-white placeholder-white/80 outline-none backdrop-blur"
    />
    <button
        type="submit"
        className="px-5 py-3 rounded-full transition-all duration-300 bg-orange-600 text-white font-semibold hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-orange-500/40"
    >
        Buscar
    </button>
</form>
);
}