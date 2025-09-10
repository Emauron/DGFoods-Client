import Showcase from "./ModalShowcase";
import { useState, useContext, useEffect, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import OrderOptions from "./OrderOptions";
import { CartContext } from "../../context/CartContext";

export default function ModalContent({ product, handleClose }) {
  const { addToCart } = useContext(CartContext);

  // ---- Guard ----
  if (!product) return null;

  // ---- Helpers ----
  const brl = (n) =>
    (Number(n) || 0).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });

  const computeTotals = (qty, basePrice, adjPrice) => {
    const q = Math.max(1, Number(qty) || 1);
    const base = Number(basePrice) || 0;
    const adj = Number(adjPrice) || 0; // soma de ajustes por unidade
    const unit = base + adj;           // preço por unidade já com ajustes
    const total = unit * q;            // total considerando a quantidade
    return { q, base, adj, unit, total };
  };

  // ---- Local UI states ----
  const [addingToCart, setAddingToCart] = useState(false);
  const [Qty, setQty] = useState(1);
  const [addPriceAdj, setAddPriceAdj] = useState(0);
  const [viewDescription, setViewDescription] = useState(false);

  // ---- Estado que irá para o carrinho ----
  const [orderProduct, setOrderProduct] = useState(() => {
    const { q, base, adj, total } = computeTotals(1, product?.price, 0);
    return {
      id: product.id,
      id_store: product.store_id,
      name: product.name,
      quantity: q,
      originalPrice: base,    // preço base por unidade (número)
      totalPrice: brl(total), // string formatada p/ exibição
      priceAdjTotal: adj,     // soma dos ajustes por unidade (número)
      optionGroups: {},       // populado pelo OrderOptions
    };
  });

  // Ao trocar de produto, resetar quantidade, ajustes e recalcular
  useEffect(() => {
    const initialQty = 1;
    setQty(initialQty);
    setAddPriceAdj(0);

    const { q, base, adj, total } = computeTotals(initialQty, product?.price, 0);
    setOrderProduct({
      id: product.id,
      id_store: product.store_id,
      name: product.name,
      quantity: q,
      originalPrice: base,
      totalPrice: brl(total),
      priceAdjTotal: adj,
      optionGroups: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Sincroniza quantity, total e ajustes sempre que Qty / price / adj mudarem
  useEffect(() => {
    const { q, base, adj, total } = computeTotals(Qty, product?.price, addPriceAdj);
    setOrderProduct((prev) => ({
      ...prev,
      quantity: q,
      originalPrice: base,
      totalPrice: brl(total),
      priceAdjTotal: adj,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Qty, addPriceAdj, product?.price]);

  // Valor exibido no rodapé (sempre consistente)
  const footerPrice = useMemo(() => {
    const { total } = computeTotals(Qty, product?.price, addPriceAdj);
    return brl(total);
  }, [Qty, product?.price, addPriceAdj]);

  // Gera um id único por linha (evita keys duplicadas na listagem do carrinho)
  const genLineId = () =>
    globalThis.crypto?.randomUUID?.() ??
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return (
    <div className="group relative flex flex-col rounded-2xl border bg-white shadow-md hover:shadow-lg transition-shadow duration-300 max-h-[80vh] w-full overflow-auto">
      {/* Área rolável do conteúdo */}
      <div className="flex-1 h-full">
        {/* Imagem */}
        <div className="relative overflow-hidden">
          <Showcase path={product.image} />
          <button
            type="button"
            aria-label="Ler descrição completa"
            className="absolute bottom-5 right-3 z-10 bg-white/80 hover:bg-white border rounded-full w-9 h-9 flex items-center justify-center text-xl leading-none shadow-sm"
            onClick={(e) => {
              e.stopPropagation();
              setViewDescription((v) => !v);
            }}
            title="Ver descrição completa"
          >
            …
          </button>
        </div>

        {/* Descrição */}
        <div className="p-4">
          <p
            className={`text-gray-700 text-sm leading-relaxed transition-colors ${
              viewDescription ? "line-clamp-none flex" : "line-clamp-4"
            } group-hover:text-gray-900`}
          >
            {product.description}
          </p>
        </div>
      </div>

      {/* Opções: emite soma de ajustes e popula orderProduct.optionGroups */}
      <OrderOptions
        product={product}
        setPriceAdj={setAddPriceAdj}
        addPriceAdj={addPriceAdj}
        setOrderProduct={setOrderProduct}
      />

      {/* Rodapé sticky com preço + botão */}
      <div className="sticky bottom-0 z-10 border-t border-gray-200/80 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="font-extrabold text-lg sm:text-xl">
            {footerPrice}
          </span>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="px-3 py-1 rounded border hover:bg-gray-50"
                onClick={() => setQty((q) => Math.max(1, Number(q) - 1))}
                aria-label={`Diminuir quantidade (atual: ${Qty})`}
              >
                –
              </button>

              <input
                className="w-16 text-center border rounded py-1"
                type="number"
                min={1}
                value={Qty}
                onChange={(e) => setQty(Number(e.target.value))}
              />

              <button
                type="button"
                className="px-3 py-1 rounded border hover:bg-gray-50"
                onClick={() => setQty((q) => Number(q) + 1)}
                aria-label={`Aumentar quantidade (atual: ${Qty})`}
              >
                +
              </button>
            </div>

            <button
              className={`inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-xl shadow-sm cat-tab ${
                addingToCart ? "opacity-70 cursor-not-allowed bg-gray-200" : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                if (addingToCart) return;

                const payload = {
                  ...orderProduct,
                  quantity: Math.max(1, Number(Qty) || 1),
                  // garantir consistência no momento do envio
                  totalPrice: footerPrice,
                  priceAdjTotal: Number(addPriceAdj) || 0,
                  lineId: genLineId(), // chave única por linha no carrinho
                };

                // Enviar ao carrinho
                addToCart(payload);
                setAddingToCart(true);
                setTimeout(() => {
                  handleClose?.();
                }, 500);
              }}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              <span className="ml-2">
                {addingToCart ? "Adicionando..." : "Adicionar"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
