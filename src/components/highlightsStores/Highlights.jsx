import React from 'react'
import Card from './Card'

export default function Highlights() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
            <Card />
            <Card />
            <Card />
            <Card />
        </div>
    )
}