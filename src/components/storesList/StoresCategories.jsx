// Se for Next.js (app router), deixe isto no topo do arquivo:
// 'use client';

import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import api from '../../services/api/api';

export default function StoresCategories() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        const load = async () => {
        try {
            const { data } = await api.get('/api/store/categories');
            console.log('resposta categorias:', data);
            if (active) setCategories(data);
        } catch (err) {
            console.error('Falha ao buscar categorias', err);
            if (active) setError('Não foi possível carregar as categorias.');
        }
        };

        load();
        return () => { active = false; };
    }, []);

    if (error) return <div>{error}</div>;
    if (categories.length === 0) return <div>Carregando...</div>;

    return (
        <section aria-labelledby="titulo-categorias pb-2" className="mb-8 md:mb-10">
            <ul className="grid overflow-x-auto grid-flow-col">
                {categories.map((c) => (
                <CategoryCard
                    key={c.id ?? c}
                    name={c.name ?? c}
                    selected={selectedCategory === (c.id ?? c)}
                />
                ))}
            </ul>
        </section>
    );
}
