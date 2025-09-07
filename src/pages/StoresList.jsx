import React from 'react'
import { useParams } from 'react-router-dom'
import Header from '../components/storesList/header'
import SearchBar from '../components/storesList/SearchBar'
import StoresCategories from '../components/storesList/StoresCategories'
export default function StoresLists() {
    const { id_city } = useParams();
    return (
        <div>
            <Header id_city={id_city} />
            <section className="mx-auto max-w-7xl px-3 sm:px-4 md:px-6 mt-4">
                <SearchBar id_city={id_city} />
            </section>
        </div>
    )
}