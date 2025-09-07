import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

// Usa BASE_URL se existir; senão, usa proxy (/api)
const BASE = import.meta.env.VITE_API_BASE_URL || '';
const api = async (path) => {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { Accept: 'application/json' },
  });
  const ct = res.headers.get('content-type') || '';
  const isJson = ct.includes('application/json');
  const body = isJson ? await res.json() : await res.text();

  if (!isJson) {
    // Ajuda a diagnosticar quando a API está devolvendo HTML
    throw new Error(`Resposta não-JSON (${res.status}) para ${path}. Cheque proxy/rotas. Trecho: ${body.slice(0,120)}`);
  }
  if (!res.ok) {
    throw new Error(body?.message || `Erro ${res.status}`);
  }
  return body;
};

export default function BackgroundHeader() {
  // cobre /lojas/:storeId e /store/:id
  const { storeId, id } = useParams();
  const effectiveId = storeId || id;

  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);
  const [errorStore, setErrorStore] = useState(null);

  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorProducts, setErrorProducts] = useState(null);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  // Loja
  useEffect(() => {
    if (!effectiveId) return;
    setLoadingStore(true);
    api(`/stores/${effectiveId}`)
      .then(setStore)
      .catch((err) => setErrorStore(err.message))
      .finally(() => setLoadingStore(false));
  }, [effectiveId]);

  // Produtos
  useEffect(() => {
    if (!effectiveId) return;
    setLoadingProducts(true);
    const qs = new URLSearchParams({
      page: String(page),
      per_page: '20',
      search,
      category,
    });
    api(`/stores/${effectiveId}/products?${qs}`)
      .then((data) => {
        setProducts(data.data || []);
        setHasMore(Boolean(data.next_page_url));
      })
      .catch((err) => setErrorProducts(err.message))
      .finally(() => setLoadingProducts(false));
  }, [effectiveId, page, search, category]);

  const onClearFilters = () => {
    setSearch('');
    setCategory('');
    setPage(1);
  };

  const Header = () => (
    <div className="store-header">
      <div
        className="store-cover"
        style={{ backgroundImage: `url(${store?.cover_url || '/fallback-cover.jpg'})` }}
      />
      <div className="store-header-content">
        <img
          className="store-logo"
          src={store?.logo_url || '/logo-placeholder.png'}
          alt={store?.name || 'Loja'}
        />
        <div className="store-title">
          <h1>{store?.name || 'Loja'}</h1>
          <div className="store-meta">
            {store?.rating ? <span className="badge">⭐ {store.rating}</span> : null}
            {store?.city ? <span className="muted">• {store.city}</span> : null}
            {typeof store?.products_count === 'number' ? (
              <span className="muted">• {store.products_count} itens</span>
            ) : null}
          </div>
        </div>
      </div>

      <div className="store-toolbar">
        <input
          className="search-input"
          placeholder="Buscar no cardápio"
          value={search}
          onChange={(e) => {
            setPage(1);
            setSearch(e.target.value);
          }}
        />
        <div className="cat-tabs">
          <button
            className={`cat-tab ${!category ? 'active' : ''}`}
            onClick={() => {
              setPage(1);
              setCategory('');
            }}
          >
            Tudo
          </button>
          {store?.categories?.map((c) => (
            <button
              key={c}
              className={`cat-tab ${category === c ? 'active' : ''}`}
              onClick={() => {
                setPage(1);
                setCategory(c);
              }}
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

  const ProductCard = ({ p }) => (
    <div className="product-card">
      <div className="product-info">
        <h3 className="product-name">{p.name}</h3>
        {p.description ? <p className="product-desc">{p.description}</p> : null}
        <div className="product-price">R$ {Number(p.price).toFixed(2).replace('.', ',')}</div>
      </div>
      <img className="product-img" src={p.image_url || '/product-placeholder.jpg'} alt={p.name} />
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

      <div className="container">
        {loadingProducts ? (
          <div className="grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton card-skeleton" />
            ))}
          </div>
        ) : errorProducts ? (
          <div className="error">⚠️ {errorProducts}</div>
        ) : products.length === 0 ? (
          <div className="empty">
            <p>Nenhum produto encontrado.</p>
            {(search || category) && <button onClick={onClearFilters}>Limpar filtros</button>}
          </div>
        ) : (
          <>
            <div className="grid">
              {products.map((p) => (
                <ProductCard key={p.id} p={p} />
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
              <button
                className="pager-btn"
                disabled={!hasMore}
                onClick={() => setPage((n) => n + 1)}
              >
                Próxima →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
