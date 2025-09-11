import React, { useMemo } from "react";

/**
 * Componente para seleção de Forma de Pagamento e Forma de Entrega.
 *
 * Props:
 * - subtotal: number (em BRL) — usado para exibir o total
 * - value: {
 *     paymentMethod: 'pix' | 'credito' | 'debito',
 *     fulfillment: 'delivery' | 'retirada',
 *     deliveryFee?: number,
 *     address?: {
 *       street?: string,
 *       number?: string,
 *       complement?: string,
 *       district?: string,
 *     }
 *   }
 * - onChange: (newValue) => void — chamado a cada alteração
 *
 * Observação: mantém o estado controlado pelo componente pai.
 */
export default function CheckoutOptions({ subtotal = 0, value, onChange }) {
    const v = value || {};

    const formatBRL = (n) =>
        (Number(n) || 0).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        });

    const total = useMemo(() => {
        const fee = v.fulfillment === "delivery" ? Number(v.deliveryFee || 0) : 0;
        return Number(subtotal || 0) + fee;
    }, [subtotal, v.fulfillment, v.deliveryFee]);

    function set(path, newVal) {
        const clone = { ...v };
        const parts = path.split(".");
        let obj = clone;
        for (let i = 0; i < parts.length - 1; i++) {
        obj[parts[i]] = obj[parts[i]] ?? {};
        obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = newVal;
        onChange?.(clone);
    }

    return (
        <div className="bg-white border rounded-2xl shadow-sm p-4 sm:p-6 space-y-5">
            <h3 className="text-base font-semibold text-gray-900">Pagamento & Entrega</h3>

            {/* Forma de Pagamento */}
            <section>
                <div className="text-sm font-medium text-gray-900 mb-2">Forma de pagamento</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <RadioCard
                    checked={v.paymentMethod === "pix"}
                    onChange={() => set("paymentMethod", "pix")}
                    title="PIX"
                    description="Chave exibida no checkout"
                    icon={(
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M7.5 7.5 12 3l4.5 4.5L12 12 7.5 7.5Z" />
                        <path d="M7.5 16.5 12 21l4.5-4.5L12 12l-4.5 4.5Z" />
                    </svg>
                    )}
                />
                <RadioCard
                    checked={v.paymentMethod === "credito"}
                    onChange={() => set("paymentMethod", "credito")}
                    title="Crédito"
                    description="Cartão de crédito"
                    icon={(
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 10h18" />
                    </svg>
                    )}
                />
                <RadioCard
                    checked={v.paymentMethod === "debito"}
                    onChange={() => set("paymentMethod", "debito")}
                    title="Débito"
                    description="Cartão de débito"
                    icon={(
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 15h5" />
                    </svg>
                    )}
                />
                </div>
            </section>

            {/* Forma de Entrega */}
            <section>
                <div className="text-sm font-medium text-gray-900 mb-2">Entrega</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <RadioCard
                            checked={v.fulfillment === "delivery"}
                            onChange={() => set("fulfillment", "delivery")}
                            title="Delivery"
                            description="Receber em endereço"
                            icon={(
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M3 7h11v10H3zM14 10h4l3 3v4h-7V10z" />
                            </svg>
                            )}
                        />
                        <RadioCard
                            checked={v.fulfillment === "retirada"}
                            onChange={() => set("fulfillment", "retirada")}
                            title="Retirada"
                            description="Retirar no balcão"
                            icon={(
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M4 7h16M6 7v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
                            </svg>
                            )}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div>
                            <Label>Nome</Label>
                            <input
                                type="text"
                                value={v.name || ""}
                                onChange={(e) => set("name", e.target.value)}
                                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ex.: João da Silva"
                            />
                        </div>
                        <div>
                            <Label>Telefone</Label>
                            <input
                                type="text"
                                value={v.phone || ""}
                                onChange={(e) => set("phone", e.target.value)}
                                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ex.: (11) 99999-9999"
                            />
                        </div>
                    </div>
                    {/* Campos adicionais quando Delivery */}
                    {v.fulfillment === "delivery" && (
                    <div className="mt-3 space-y-3">
                        <div className="grid grid-cols-6 gap-3">
                            <div className="col-span-4">
                                <Label>Rua</Label>
                                <input
                                type="text"
                                value={v.address?.street || ""}
                                onChange={(e) => set("address.street", e.target.value)}
                                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Ex.: Av. Brasil"
                                />
                            </div>
                            <div className="col-span-2">
                                <Label>Número</Label>
                                <input
                                type="text"
                                value={v.address?.number || ""}
                                onChange={(e) => set("address.number", e.target.value)}
                                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="123"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-6 gap-3">
                            <div className="col-span-3">
                                <Label>Bairro</Label>
                                <input
                                type="text"
                                value={v.address?.district || ""}
                                onChange={(e) => set("address.district", e.target.value)}
                                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Centro"
                                />
                            </div>
                            <div className="col-span-3">
                                <Label>Complemento</Label>
                                <input
                                type="text"
                                value={v.address?.complement || ""}
                                onChange={(e) => set("address.complement", e.target.value)}
                                className="mt-1 w-full rounded-xl border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Apto 201"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

/** Componentes auxiliares **/
function Label({ children }) {
  return <label className="text-xs font-medium text-gray-600">{children}</label>;
}

function RadioCard({ checked, onChange, title, description, icon }) {
  return (
    <button
        type="button"
        onClick={onChange}
        className={
            "w-full text-left rounded-2xl border p-3 transition shadow-sm " +
            (checked
            ? "border-orange-500 ring-2 ring-orange-200 bg-orange-50"
            : "hover:border-gray-300")
        }
    >
        <div className="flex items-start gap-3">
            <div className={
                "mt-0.5 w-5 h-5 rounded-full flex items-center justify-center border " +
                (checked ? "border-orange-500" : "border-gray-300")
                }>
                <div className={"w-2.5 h-2.5 rounded-full " + (checked ? "bg-orange-500" : "bg-transparent")} />
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2">
                    {icon}
                    <span className="font-medium text-gray-900">{title}</span>
                </div>
                {description && (
                    <p className="text-xs text-gray-500 mt-0.5">{description}</p>
                )}
            </div>
        </div>
    </button>
  );
}
