import Showcase from "./ModalShowcase";
import { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import OrderOptions from "./OrderOptions";
import { CartContext } from "../../context/CartContext";

export default function ModalContent({ product, handleClose }) {
  const { addToCart } = useContext(CartContext);
  const [addingToCart, setAddingToCart] = useState(false);
  if (!product) return null;

  const [addPriceAdj, setAddPriceAdj] = useState(0);

  function getPrecoBRL() {
    const base = Number(product?.price) || 0;
    const adj = Number(addPriceAdj) || 0;
    const total = base + adj;
    return total.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }

  // Estado do item que irá para o carrinho
  const [orderProduct, setOrderProduct] = useState(() => ({
    id: product.id,
    id_store: product.store_id,
    name: product.name,
    originalPrice: Number(product.price) || 0,
    totalPrice: getPrecoBRL(),   // string formatada (para exibir)
    priceAdjTotal: 0,            // número (para salvar)
    optionGroups: {},            // será populado pelos OrderChoices (por grupo)
  }));

  // Ao trocar de produto, zere ajustes e opções
  useEffect(() => {
    setAddPriceAdj(0);
    setOrderProduct({
      id: product.id,
      id_store: product.store_id,
      name: product.name,
      originalPrice: Number(product.price) || 0,
      totalPrice: getPrecoBRL(),
      priceAdjTotal: 0,
      optionGroups: {},
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

  // Mantém totalPrice e priceAdjTotal sincronizados com os ajustes
  useEffect(() => {
    setOrderProduct((prev) => ({
      ...prev,
      totalPrice: getPrecoBRL(),
      priceAdjTotal: Number(addPriceAdj) || 0,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addPriceAdj, product?.price]);

  const [viewDescription, setViewDescription] = useState(false);

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
            {getPrecoBRL()}
          </span>

          <button
            className={`inline-flex items-center justify-center w-full sm:w-auto px-4 py-2.5 rounded-xl shadow-sm cat-tab 
                                ${addingToCart ? "opacity-70 cursor-not-allowed bg-gray-200" : ""} `}
            onClick={(e) => {
              e.stopPropagation();
              if (addingToCart) return;
              addToCart(orderProduct); // <- agora contém optionGroups e priceAdjTotal
              setAddingToCart(true);
              setTimeout(() => {
                handleClose();
              }, 500);
            }}
          >
            <FontAwesomeIcon icon={faShoppingCart} />{" "}
            {addingToCart ? "Adicionando..." : "Adicionar"}
          </button>
        </div>
      </div>
    </div>
  );
}
