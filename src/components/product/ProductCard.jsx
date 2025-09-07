import React from "react";

export default function ProductCard({ product }) {
  const price = Number(product?.price ?? 0);

  return (
    <div className="product-card">
      <div className="product-info">
        <h3 className="product-name">{product?.name}</h3>
        {product?.description ? (
          <p className="product-desc">{product.description}</p>
        ) : null}
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
  );
}