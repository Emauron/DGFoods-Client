import React from 'react';

export default function CopyrightBottom() {
    const year = new Date().getFullYear();
    return (
        <div className="relative text-center text-sm text-gray-500  bg-white py-10 w-full filter drop-shadow-[0_-2px_3px_rgba(0,0,0,0.10)]">
            <p>Sistema para delivery | Site para restaurante | Cardápio Digital</p>
            <p>DG Food</p>
            <p>© 2025 - {year}. Todos os direitos reservados.</p>
        </div>
    );
}
