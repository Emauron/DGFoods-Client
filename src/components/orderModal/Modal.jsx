// Modal.jsx
import { useEffect, useRef, useState } from "react";
import ModalContent from "./ModalContent.jsx";
import api from "../../services/api/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Modal({ id_product, onClose }) {
  const [show, setShow] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const closeBtnRef = useRef(null);

  // abre com animação
  useEffect(() => {
    setShow(true);
  }, []);

  // foco inicial no botão fechar
  useEffect(() => {
    if (show && !isClosing) {
      closeBtnRef.current?.focus();
    }
  }, [show, isClosing]);

  // ESC fecha (apenas quando visível)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };
    if (show && !isClosing) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [show, isClosing]);

  // travar scroll só quando visível
  useEffect(() => {
    if (show && !isClosing) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [show, isClosing]);

  const handleClose = () => {
    setIsClosing(true);
    setShow(false);
    // mesmo tempo do duration-300
    setTimeout(() => {
      onClose?.();
    }, 300);
  };

  // carrega produto
  useEffect(() => {
    if (!id_product) return;

    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        // >>> corrige a rota: precisa da "/"
        const response = await api.get(`/api/products/${id_product}`);
        if (!alive) return;
        if (response.status === 200) {
          setProduct(response.data);
        } else {
          setError("Não foi possível carregar o produto.");
          console.error(response.data);
        }
      } catch (err) {
        if (!alive) return;
        setError("Falha ao carregar o produto.");
        console.error(err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [id_product]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity duration-300 ${
        show && !isClosing ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-label="Detalhes do produto"
    >
      <div
        className={`bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden transform transition-all duration-300 ${
          show && !isClosing ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="sticky top-0 z-10 flex justify-between items-center gap-4 px-5 py-3 border-b border-gray-200 bg-white/90 backdrop-blur">
          <h1 className="text-lg font-semibold truncate">
            {product?.name ?? "Carregando..."}
          </h1>
          <button
            ref={closeBtnRef}
            className="text-xl leading-none p-2 rounded hover:bg-gray-100 focus:outline-none  focus:ring-gray-300"
            aria-label="Fechar"
            onClick={handleClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {/* Corpo rolável */}
        <div className="p-5 overflow-y-auto max-h-[calc(90vh-56px)]">
          {loading && (
            <div className="animate-pulse space-y-3">
              <div className="h-40 bg-gray-100 rounded" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
              <div className="h-4 bg-gray-100 rounded w-2/3" />
            </div>
          )}

          {!loading && error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          {!loading && !error && product && (
            <ModalContent product={product} handleClose={handleClose}/>
          )}
        </div>
      </div>
    </div>
  );
}
