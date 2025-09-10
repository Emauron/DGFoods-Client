import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { CartContext } from "../../context/CartContext";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
export default function FloatingCartButton({
  count = 0,
  title = "Abrir carrinho",
  store_id
}) {
    const navigate = useNavigate();
    const { cart } = useContext(CartContext);
    var totalPrice = 0;
    cart.map((item) => {
        if(item.id_store == store_id) {
            totalPrice += Number(item.totalPrice.replace("R$", "").replace(".", "").replace(",", "."));
        }
    });
    return (
        <button
        type="button"
        aria-label={title}
        onClick={() => navigate(`/checkout/${store_id}`)}
        className="
            group fixed bottom-6 right-6 z-50
            w-16 h-16 rounded-full
            bg-white
            bg-gradient-to-br 
            shadow-lg shadow-orange-500/30 dark:shadow-black/40
            ring-1 ring-white/30
            flex items-center justify-center
            transition-transform duration-300 hover:scale-110 active:scale-95
            focus:outline-none focus-visible:ring-4 focus-visible:ring-orange-300/50
        "
        >
            {/* Badge de quantidade */}
            {totalPrice > 0 && (
                <span
                aria-hidden="true"
                className="
                    absolute -top-2 -right-4
                    min-w-6 h-6 px-1
                    rounded-full bg-rose-600 text-white
                    text-[11px] leading-6 text-center font-semibold
                    ring-2 ring-white shadow
                    transition-transform duration-300
                    group-hover:scale-110
                "
                >
                {totalPrice.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    minimumFractionDigits: 2,
                })}
                </span>
            )}

            {/* Ícone */}
            <FontAwesomeIcon
                icon={faShoppingCart}
                className="text-2xl drop-shadow-sm"
            />

            {/* Tooltip simples */}
            <span
                className="
                pointer-events-none select-none
                absolute -top-9 right-1/2 translate-x-1/2
                whitespace-nowrap rounded-md bg-black/80 text-white
                px-2 py-1 text-[11px] opacity-0 -translate-y-1
                transition-all duration-200
                group-hover:opacity-100 group-hover:translate-y-0
                "
            >
                {title}
            </span>
        </button>
    );
}