import React, { useContext, useMemo, useState  } from "react";
import { useParams } from "react-router-dom";
import { CartContext } from "../../context/CartContext";
import ResumeOrder from "./ResumeOrder";
import CheckoutOptions from "./CheckoutOptions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

/* Util: converte "R$ 12,34" -> 12.34 */
function toNumber(val) {
    if (typeof val === "number") return val;
    if (typeof val === "string") {
        const clean = val.replace(/[^\d,.-]/g, "").replace(/\./g, "").replace(",", ".");
        const num = Number(clean);
        return Number.isFinite(num) ? num : 0;
    }
    return 0;
}

/* Util: formata BRL */
function formatBRL(n) {
    return (Number(n) || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
    });
}

/* Linha do carrinho (apenas visual) */
function CartRow({ item, removeFromCart }) {
    return (
        <div className="flex py-1">
            {/* Quantidade como pill */}
            <div className="min-w-10">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full  text-gray-800 text-sm font-semibold ">
                    {item.quantity} x
                </span>
            </div>

            {/* Título + (opções, se tiver) */}
            <div className="">
                <h3 className="font-medium text-gray-900 truncate">{item.name}</h3>
                {/* Exemplo: se você tiver opções em item.optionGroups, pode exibi-las aqui */}
                {item.optionGroups && Object.keys(item.optionGroups).length > 0 && (
                    <div>
                        {Object.keys(item.optionGroups).map((key) => (
                            <div key={key} className="mt-0.5 text-xs text-gray-500  truncate">
                                {item.optionGroups[key].map((opt) => (
                                    <div key={opt.id}>{opt.quantity}x {opt.name}</div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Preço total do item */}
            <div className="text-right flex-1">
                <div className="">
                    <span className="font-semibold text-gray-900">{item.totalPrice} 
                        <FontAwesomeIcon icon={faTrash} className="text-gray-500 ml-2 cursor-pointer" onClick={() => removeFromCart(item)} />    
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function CartItems({ store_id: storeIdProp }) {
    // Aceita store_id via prop OU via URL (fallback)
    const { store_id: storeIdFromRoute } = useParams();
    const storeIdNum = Number(storeIdProp ?? storeIdFromRoute);
    const { cart, clearCart } = useContext(CartContext);
    const { removeFromCart } = useContext(CartContext);
    // Seleciona itens da loja e cria keys estáveis sem MUTAR o objeto original
    const items = useMemo(() => {
        const list = (cart || []).filter(
        (raw) => Number(raw.id_store) === storeIdNum
        );

        // Para evitar chaves repetidas quando ids colidem,
        // criamos um contador por id e geramos lineId composto.
        const seen = new Map(); // id -> count
        return list.map((raw, idx) => {
        const id = raw.id ?? "noid";
        const n = (seen.get(id) ?? 0) + 1;
        seen.set(id, n);
        return { ...raw, lineId: `${id}-${n}-${idx}` };
        });
    }, [cart, storeIdNum]);

    const subtotal = useMemo(
        () => items.reduce((acc, it) => acc + toNumber(it.totalPrice), 0),
        [items]
    );

    const [checkout, setCheckout] = useState({
        name: "",
        phone: "",
        paymentMethod: "pix",        // 'pix' | 'credito' | 'debito'
        fulfillment: "retirada",     // 'delivery' | 'retirada'
        deliveryFee: 0,
        address: { street: "", number: "", complement: "", district: "" },
      });
    // Layout: lista (2 colunas) + resumo (coluna direita sticky em telas grandes)
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de itens */}
            <section className="lg:col-span-2 flex flex-col gap-4">
                <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6">
                <div className="flex items-center justify-between mb-2">
                    <h2 className="text-lg font-semibold text-gray-900">
                    Itens do Carrinho
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 cursor-pointer hover:underline" onClick={() => clearCart()}>
                            Limpar
                        </span>
                        <span className="text-sm text-gray-500">
                        {items.length} {items.length === 1 ? "item" : "itens"}
                        </span>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center">
                            {/* Ícone vazio (SVG simples) */}
                            <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-gray-400"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 3h1.386c.51 0 .955.343 1.09.835l.383 1.434m0 0L6.75 12.75M5.109 5.269h12.972a1.125 1.125 0 011.097 1.39l-1.11 4.438a2.25 2.25 0 01-2.183 1.712H8.25m-3.141-7.54l1.26 4.909m0 0L7.5 18.75h9.75m0 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM7.5 18.75a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z"
                            />
                            </svg>
                        </div>
                        <p className="text-gray-700 font-medium">
                            Seu carrinho está vazio.
                        </p>
                        <p className="text-gray-500 text-sm">
                            Adicione produtos para visualizar aqui.
                        </p>
                    </div>
                ) : (
                    <>
                    <div className="divide-y max-h-[550px] overflow-y-auto">
                        {items.map((item) => (
                            <CartRow key={item.lineId} item={item} removeFromCart={removeFromCart} />
                        ))}
                    </div>

                    {/* Observação/aviso opcional */}
                    <div className="mt-4 text-xs text-gray-500">
                        * Os valores podem variar conforme as opções selecionadas para
                        cada item.
                    </div>
                    </>
                )}
                </div>
                <CheckoutOptions subtotal={subtotal} value={checkout} onChange={setCheckout}/>
            </section>

            <ResumeOrder items={items} subtotal={subtotal} />
        </div>
    );
}
