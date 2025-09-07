import React, { useState } from "react";

export default function ProductCard({ product }) {
  const [openDesc, setOpenDesc] = useState(false);
  const price = Number(product?.price ?? 0);

  return (
    <>
      <div className="product-card">
        <div className="product-info">
          <h3 className="product-name">{product?.name}</h3>

          {product?.description && (
            <div className="relative">
              {/* Trecho com clamp (não cresce o card) */}
              <p className="product-desc clamp-4 pr-10">
                {product.description}
              </p>

              {/* Fade no final para dar sensação de “continua” */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent"></div>

              {/* Botão “...” para abrir a descrição completa */}
              <button
                type="button"
                aria-label="Ler descrição completa"
                className="absolute bottom-1 right-1 z-10 bg-white/90 hover:bg-white border rounded-full w-8 h-8 flex items-center justify-center text-xl leading-none"
                onClick={() => setOpenDesc(true)}
                title="Ver descrição completa"
              >
                …
              </button>
            </div>
          )}

          <div className="product-price">
            R$ {price.toFixed(2).replace(".", ",")}
          </div>
        </div>

        <img
          className="product-img"
          src={product?.image_url || "/product-placeholder.jpg"}
          alt={product?.name || "Produto"}
          loading="lazy"
        />
      </div>

      {/* Modal com a descrição completa (não altera layout do card) */}
      {openDesc && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setOpenDesc(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full max-h-[70vh] overflow-y-auto p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <h4 className="font-semibold text-lg">{product?.name}</h4>
              <button
                className="text-2xl leading-none px-2"
                aria-label="Fechar"
                onClick={() => setOpenDesc(false)}
              >
                ×
              </button>
            </div>

            <p className="whitespace-pre-line">{product?.description}</p>
          </div>
        </div>
      )}
    </>
  );
}