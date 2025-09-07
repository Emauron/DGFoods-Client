import { useState, useEffect, useRef } from "react";
import api from "../../services/api/api";
import { useNavigate } from "react-router-dom";

export default function SearchBar({ placeholder, onSearch }) {
    const navigate = useNavigate();

    const [value, setValue] = useState("");
    const [cities, setCities] = useState([]);
    const [filteredCities, setFilteredCities] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState(null); // guarda id, name, uf

    const containerRef = useRef(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    const handleSearch = async () => {
        try {
        const response = await api.get("api/store/cities");
        setCities(response.data);
        setFilteredCities(response.data);
        } catch (error) {
        console.error(error);
        }
    };

    const handleFilter = (event) => {
        const query = event.target.value;
        setValue(query);
        setSelectedCity(null); // limpamos a seleção ao digitar
        if (query) {
        const filtered = cities.filter((city) =>
            city.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredCities(filtered);
        } else {
        setFilteredCities(cities);
        }
    };

    const handleCitySelect = (city) => {
        setSelectedCity(city); // salva id e dados
        const label = `${city.name} - ${city.uf}`;
        setValue(label);
        onSearch && onSearch(label, city.id); // 1º arg: label; 2º arg: id
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        }
    };

    useEffect(() => {
            handleSearch();
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            };
    }, []);

    // tenta submeter usando a seleção atual ou casar o texto com alguma cidade
    const submitWithCurrent = () => {
        // Se o dropdown está aberto e tem itens, priorize o 1º (caso Enter seja pressionado sem clicar)
        if (isOpen && filteredCities.length > 0) {
            handleCitySelect(filteredCities[0]);
            return;
        }

        if (selectedCity) {
            const label = `${selectedCity.name} - ${selectedCity.uf}`;
            onSearch && onSearch(label, selectedCity.id);
            setIsOpen(false);
            return;
        }

        // fallback: tenta casar o texto com uma cidade pelo label completo ou só pelo nome
        const lower = value.trim().toLowerCase();
        const matched =
            cities.find(
                (c) => `${c.name} - ${c.uf}`.toLowerCase() === lower
            ) || cities.find((c) => c.name.toLowerCase() === lower);

        if (matched) {
            handleCitySelect(matched);
        } else {
            // não encontrou id correspondente; envia somente o texto
            onSearch && onSearch(value.trim(), null);
            setIsOpen(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault(); // evita submit duplo
            submitWithCurrent(); // Enter seleciona a 1ª opção (se houver) e sempre tenta levar um id
        }
    };

    return (
        <div className="relative">
        <form
            onSubmit={(e) => {
            e.preventDefault();
            // Clique no botão "Buscar" cai aqui:
            // Se houver seleção, usa; senão tenta casar pelo texto
            if (selectedCity) {
                const label = `${selectedCity.name} - ${selectedCity.uf}`;
                onSearch && onSearch(label, selectedCity.id);
                setIsOpen(false);
            } else {
                submitWithCurrent();
            }
            }}
            role="search"
            aria-label="Buscar lojas filiadas"
            className="flex gap-2 justify-center"
        >
            {/* Wrapper com largura controlada (input + dropdown) */}
            <div
            ref={containerRef}
            className="relative w-full max-w-[420px]"
            >
            <input
                ref={inputRef}
                value={value}
                onChange={handleFilter}
                onFocus={() => setIsOpen(true)}
                onKeyDown={handleKeyDown} // Enter seleciona a 1ª opção
                placeholder={placeholder}
                className="w-full z-10 px-5 py-3 rounded-full border border-white/40 bg-white/20 text-white placeholder-white/80 outline-none backdrop-blur"
            />

            {isOpen && filteredCities.length > 0 && (
                <ul
                ref={dropdownRef}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md shadow-lg max-h-48 overflow-y-auto border border-gray-200 z-20"
                >
                {filteredCities.map((city) => (
                    <li
                    key={city.id}
                    onClick={() => handleCitySelect(city)}
                    className="px-4 py-3 cursor-pointer hover:bg-orange-100 hover:text-orange-600 transition-all duration-200 rounded-md text-black text-sm text-left"
                    >
                    {`${city.name} - ${city.uf}`}
                    </li>
                ))}
                </ul>
            )}
            </div>

            <button
                type="submit"
                className="px-5 py-3 rounded-full transition-all duration-300 bg-orange-600 text-white font-semibold hover:brightness-95 focus:outline-none focus:ring-4 focus:ring-orange-500/40"
                onClick={() => navigate(`/stores_list/${selectedCity.id_city}`)}
            >
                Buscar
            </button>
        </form>
        </div>
    );
}
