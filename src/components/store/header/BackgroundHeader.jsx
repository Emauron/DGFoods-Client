import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import ProductsList from "../../product/ProductsList";
import FloatingCartButton from "../../store/FloatingCartButton";
import { CartContext } from "../../../context/CartContext";
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
  const { cart } = useContext(CartContext);
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
	<div
	  className="store-header"
	  style={{
		backgroundImage: `url("/uploads/emautanBackground.png")`,
		backgroundSize: "cover",
		backgroundPosition: "center",
	  }}
	>
		<div className="store-cover"
			style={{
			backgroundImage: `url(${store?.cover_url || "/fallback-cover.jpg"})`,
			}}
		/>
			<div className="store-header-content w-full flex justify-center items-end">
				<div className="flex w-full sm:w-8/12 mx-auto px-4 items-end">
					<img
						className="store-logo"
						src={store?.logo_url || "/logo-placeholder.png"}
						alt={store?.name || "Loja"}
					/>
					<div className="store-title ml-4">
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
			</div>
	
			<div className="w-full flex justify-center">
				<div
					className="store-toolbar w-full sm:w-8/12 mx-auto px-4"
					style={{
					backgroundColor: "rgba(255, 255, 255, 0.95)", // fundo branco semi-transparente
					padding: "1.5rem", // aumenta altura (pode ajustar)
					marginTop: "-2rem", // sobrepõe e cola no background
					borderRadius: "8px", // opcional: arredondar bordas
					}}
				>
					<div className="toolbar-row">
					<Link to="/" className="back-btn" aria-label="Voltar ao início">
						← Início
					</Link>

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
      <FloatingCartButton
        count={22}
        onClick={() => {/* abrir modal/carrinho */}}
        title="Ver carrinho"
        store_id={effectiveId}
      />
    </div>
  );
}
