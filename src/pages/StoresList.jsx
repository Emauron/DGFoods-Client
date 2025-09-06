import React from 'react'
import { useParams } from 'react-router-dom'

export default function StoresLists() {
    const { id_city } = useParams();
    return (
        <div>
            <h1>Stores Lists</h1>
            <p>Id City: {id_city}</p>

        </div>
    )
}