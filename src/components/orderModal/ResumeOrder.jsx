import { useContext } from "react";
import { CartContext } from "../../context/CartContext";

function formatBRL(n) {
    return (Number(n) || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

export default function ResumeOrder({ items, subtotal }) {
    const { cart } = useContext(CartContext);
    return (
        <aside className="lg:col-span-1">
            <div className="lg:sticky lg:top-6">
                <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">
                    Resumo do pedido
                    </h3>

                    <dl className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                        <dt className="text-gray-600">Subtotal</dt>
                        <dd className="font-medium text-gray-900">
                        {formatBRL(subtotal)}
                        </dd>
                    </div>
                    {/* Caso tenha frete/taxa, some aqui e exiba */}
                    {/* <div className="flex items-center justify-between">
                        <dt className="text-gray-600">Entrega</dt>
                        <dd className="font-medium text-gray-900">{formatBRL(0)}</dd>
                    </div> */}
                    <div className="h-px bg-gray-200 my-3" />
                    <div className="flex items-center justify-between text-base">
                        <dt className="font-semibold text-gray-900">Total</dt>
                        <dd className="font-extrabold text-gray-900">
                        {formatBRL(subtotal)}
                        </dd>
                    </div>
                    </dl>

                    <button
                    disabled={items.length === 0}
                    className={`mt-5 w-full rounded-xl px-4 py-3 text-sm font-semibold shadow-sm transition
                        ${
                        items.length === 0
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                    onClick={() => {
                        if (items.length === 0) return;
                        // Chame sua navegação/checkout real aqui
                        // ex: navigate('/checkout/confirm')
                        console.log("Finalizar pedido");
                    }}
                    >
                    Finalizar pedido
                    </button>

                    <p className="mt-3 text-xs text-gray-500 text-center">
                    Ao continuar, você concorda com os termos e condições.
                    </p>
                </div>
            </div>
        </aside>
    );
}
