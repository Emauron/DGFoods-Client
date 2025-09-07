import React, { useState } from 'react';
import CategoryCard from './CategoryCard';

export default function StoresCategories() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);

    useEffect(async () => {
        const response = await api.get(`/api/store/categories`);
        setCategories(response.data);
    }, []);

    if (categories.length === 0) {
        return <div>Carregando...</div>
    }
    
    return (
        <section aria-labelledby="titulo-categorias" className="mb-8 md:mb-10">
            <div className="mb-3 flex items-center justify-between">
                <h2 id="titulo-categorias" className="text-lg md:text-xl font-semibold">Categorias</h2>
                <button className="text-sm text-gray-700 hover:underline">Ver todas</button>
            </div>
            <ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 sm:gap-4">
                {categories.map((c) => (
                    <CategoryCard
                        key={c}
                        name={c}
                        selected={selectedCategory === c}
                    />
                ))}
            </ul>
        </section>
    );
}