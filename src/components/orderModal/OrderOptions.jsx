import { useState, useEffect, useMemo } from "react";
import api from "../../services/api/api";
import OrderChoices from "./OrderChoices";

export function OrderOptions({ product, setPriceAdj, addPriceAdj = 0, setOrderProduct}) {
    const [optionsGroup, setOptionsGroup] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mapa de ajustes por GRUPO => { [groupId]: number }
    const [groupAdj, setGroupAdj] = useState({});

    const getOption = async () => {
        try {
            const response = await api.get(`/api/products/${product.id}/options`);
            if (response.status === 200) {
            setOptionsGroup(response.data || []);
            setLoading(false);
            } else {
            console.error(response.data);
            }
        } catch (error) {
            console.error(error);
        }
    };


    // ao trocar de produto, recarrega grupos e zera ajustes
    useEffect(() => {
        setGroupAdj({});
        setLoading(true);
        getOption();    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product?.id]);


    // soma total = Σ ajustes de todos os grupos
    const totalAdj = useMemo(
        () => Object.values(groupAdj).reduce((a, b) => a + (Number(b) || 0), 0),
        [groupAdj]
    );

    // emite para o pai (ProductCard)
    useEffect(() => {
        if (typeof setPriceAdj === "function") setPriceAdj(totalAdj);
    }, [totalAdj, setPriceAdj]);


    // callback para cada grupo atualizar seu PRÓPRIO ajuste
    const handleGroupAdjChange = (groupId, adj) => {
        setGroupAdj((prev) => ({ ...prev, [groupId]: Number(adj) || 0 }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {optionsGroup.map((optionGroup) => (
                <div key={optionGroup.id} className="w-full relative">
                    <h1 className="text-lg font-bold text-center text-gray-700 border-b border-gray-200 py-3 mb-2">
                        {optionGroup.name}
                    </h1>
                    <p className="text-sm text-right text-gray-500 px-4 absolute right-0">
                        Max:{optionGroup.max_choice}
                    </p>
                    <div className="flex flex-wrap gap-2 w-full">
                        <OrderChoices
                        optionGroup={optionGroup}
                        // cada grupo reporta seu ajuste individual
                        setPriceAdj={(adj) => handleGroupAdjChange(optionGroup.id, adj)}
                        setOrderProduct={setOrderProduct}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
}


export default OrderOptions;