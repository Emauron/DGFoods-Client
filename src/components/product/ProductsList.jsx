import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard.jsx";

// Helper de API local (pode extrair para src/services/api.js se preferir)
const BASE = import.meta.env.VITE_API_BASE_URL || "";
const api = async (path) => {
  const res = await fetch(`${BASE}/api${path}`, { headers: { Accept: "application/json" } });
  const ct = res.headers.get("content-type") || "";
  const isJson = ct.includes("application/json");
  const body = isJson ? await res.json() : await res.text();
  if (!isJson) throw new Error(`Resposta não-JSON (${res.status}) para ${path}`);
  if (!res.ok) throw new Error(body?.message || `Erro ${res.status}`);
  return body;
};

// Debounce simples
function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function ProductsList({ storeId, search, category, onClearFilters }) {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const debouncedSearch = useDebounced(search, 350);

  // sempre que a busca/categoria/loja mudar, volta pra página 1
  useEffect(() => setPage(1), [debouncedSearch, category, storeId]);

  // carregar produtos
  useEffect(() => {
    if (!storeId) return;
    setLoadingProducts(true);
    setErrorProducts(null);

    const qs = new URLSearchParams({
      page: String(page),
      per_page: "20",
      search: debouncedSearch,
      category,
    });

    api(`/stores/${storeId}/products?${qs}`)
      .then((data) => {
        setProducts(data.data || []);
        setHasMore(Boolean(data.next_page_url));
      })
      .catch((err) => setErrorProducts(err.message))
      .finally(() => setLoadingProducts(false));
  }, [storeId, page, debouncedSearch, category]);

  // Renderização
  if (loadingProducts) {
    return (
      <div className="container">
        <div className="grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton card-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (errorProducts) {
    return <div className="container error">⚠️ {errorProducts}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="container empty">
        <p>Nenhum produto encontrado.</p>
        {(search || category) && (
          <button className="clear-btn" onClick={onClearFilters}>
            Limpar filtros
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <div className="pager">
        <button
          className="pager-btn"
          disabled={page === 1}
          onClick={() => setPage((n) => Math.max(1, n - 1))}
        >
          ← Anterior
        </button>
        <span>Página {page}</span>
        <button className="pager-btn" disabled={!hasMore} onClick={() => setPage((n) => n + 1)}>
          Próxima →
        </button>
      </div>
    </div>
  );
}
