import React, { useState, useEffect } from 'react'
import Card from './Card'
import api from '../../services/api/api'

export default function Highlights() {
    const [highlights, setHighlights] = useState([])
    const getHighlights = async () => {
        try {
            const response = await api.get('/api/store/highlights')
            console.log(response.data)
            setHighlights(response.data)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        getHighlights()
    }, [])

    if (highlights.length === 0) {
        return <div>Carregando...</div>
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center" id="highlights">
            {highlights.map((store) => (
                <Card key={store.id} store={store} />
            ))}
        </div>
    )
}