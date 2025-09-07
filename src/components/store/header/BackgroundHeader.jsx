import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProductsList from "../../product/ProductsList.jsx";

// Helper de API (pode extrair para src/services/api.js)
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

export default function BackgroundHeader() {
  // cobre /lojas/:storeId e /store/:id
  const { storeId, id } = useParams();
  const effectiveId = storeId || id;

  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);
  const [errorStore, setErrorStore] = useState(null);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  // Loja
  useEffect(() => {
    if (!effectiveId) return;
    setLoadingStore(true);
    api(`/stores/${effectiveId}`)
      .then(setStore)
      .catch((err) => setErrorStore(err.message))
      .finally(() => setLoadingStore(false));
  }, [effectiveId]);

  const onClearFilters = () => {
    setSearch("");
    setCategory("");
  };

  const Header = () => (
    <div className="store-header">
      <div
        className="store-cover"
        style={{
          backgroundImage: `url(${store?.cover_url || "/fallback-cover.jpg"})`,
        }}
      />
      <div className="store-header-content">
        <img
          className="store-logo"
          src={store?.logo_url || "/logo-placeholder.png"}
          alt={store?.name || "Loja"}
        />
        <div className="store-title">
          <h1>{store?.name || "Loja"}</h1>
          <div className="store-meta">
            {store?.rating ? <span className="badge">⭐ {store.rating}</span> : null}
            {store?.city ? <span className="muted">• {store.city}</span> : null}
            {typeof store?.products_count === "number" ? (
              <span className="muted">• {store.products_count} itens</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="store-toolbar">
        <div className="toolbar-row">
          {/* Botão de voltar para a Home (Hero/SerachStore) */}
          <Link to="/" className="back-btn" aria-label="Voltar ao início">
            ← Início
          </Link>

          {/* Evita submit/reload da página */}
          <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%" }}>
            <input
              className="search-input"
              placeholder="Buscar no cardápio"
              value={search}
              autoFocus
              onChange={(e) => setSearch(e.target.value)}
            />
          </form>
        </div>

        <div className="cat-tabs">
          <button
            className={`cat-tab ${!category ? "active" : ""}`}
            onClick={() => setCategory("")}
          >
            Tudo
          </button>
          {store?.categories?.map((c) => (
            <button
              key={c}
              className={`cat-tab ${category === c ? "active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {(search || category) && (
          <button className="clear-btn" onClick={onClearFilters}>
            Limpar filtros
          </button>
        )}
      </div>
    </div>
  );

  if (!effectiveId) {
    return (
      <div className="container">
        <p>Não foi possível identificar a loja na URL.</p>
      </div>
    );
  }

  return (
    <div className="store-page">
      {loadingStore ? (
        <div className="skeleton header-skeleton" />
      ) : errorStore ? (
        <div className="container error">⚠️ {errorStore}</div>
      ) : (
        <Header />
      )}

      {/* Agora os produtos são totalmente controlados pelo componente ProductsList */}
      <ProductsList
        storeId={effectiveId}
        search={search}
        category={category}
        onClearFilters={onClearFilters}
      />
    </div>
  );
}
