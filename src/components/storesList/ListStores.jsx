import { useState, useEffect } from 'react';
import api from '../../services/api/api';
import StoreCard from './StoreCard';
export default function ListStores( { id_city }) {
    const [stores, setStores] = useState([]);
    const [noStores, setNoStores] = useState(false);
    const getStores = async () => {
        try{
            const response = await api.get(`/api/store/list/${id_city}`);
            setStores(response.data);
            if (response.data.length === 0) {
                setNoStores(true);
            }
        }catch(error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getStores();
    }, [id_city]);
    if (stores.length === 0 && noStores === false) {
        return <div>Carregando...</div>
    }
    if (stores.length === 0 && noStores === true) {
        return <div>Nenhuma loja encontrada</div>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {stores.map((store) => (
                <StoreCard key={store.id} store={store} />
            ))}
        </div>
    )
}
