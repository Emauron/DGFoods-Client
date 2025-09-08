import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/storesList/header'
import SearchBar from '../components/storesList/searchBar'
import StoresCategories from '../components/storesList/StoresCategories'
import ListStores from '../components/storesList/ListStores'
export default function StoresLists() {
    const { id_city } = useParams();
    return (
        <div className="min-h-screen">
            <Header id_city={id_city} />
            <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 mt-4">
                <SearchBar id_city={id_city} />
            </section>
            <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2 mt-4 flex flex-col gap-4">
                <StoresCategories />
            </section>
            <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 py-2 mt-4">
                <h2 className="text-2xl font-bold text-gray-800 text-center mb-4 default-orange">Lojas</h2>
                <ListStores id_city={id_city} />
            </section>
        </div>
    )
}