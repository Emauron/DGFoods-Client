import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { CartContext } from '../../context/CartContext';

function toNumber(val) {
  if (typeof val === 'number') return val;
  if (typeof val === 'string') {
    // remove moeda/espacos e converte vírgula para ponto
    const clean = val.replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.');
    const num = Number(clean);
    return Number.isFinite(num) ? num : 0;
  }
  return 0;
}

function formatBRL(n) {
  return (Number(n) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function CartItems() {
  const { store_id } = useParams();
  const storeIdNum = Number(store_id); // <— importante!
  const { cart } = useContext(CartContext);

  const items = useMemo(() => {
    const grouped = new Map();

    for (const raw of cart || []) {
      if (Number(raw.id_store) !== storeIdNum) continue;

      // Considere opções na chave se elas diferenciarem o item
      const optionsKey = JSON.stringify(raw.optionGroups ?? {});
      const key = `${raw.id}|${optionsKey}`;

      // preço unitário = preço base + ajustes (se existirem)
      const base = toNumber(raw.originalPrice ?? raw.price ?? 0);
      const adj  = toNumber(raw.priceAdjTotal ?? 0);
      const unit = base + adj;

      const qty = Number(raw.quantity ?? 1);

      if (!grouped.has(key)) {
        grouped.set(key, {
          ...raw,
          quantity: qty,
          unitPrice: unit,
          key, // usado no React
        });
      } else {
        const acc = grouped.get(key);
        acc.quantity += qty;
      }
    }

    return Array.from(grouped.values()).map(item => ({
      ...item,
      total: item.unitPrice * item.quantity,
    }));
  }, [cart, storeIdNum]);

  return (
    <div>
      <h1>Itens do Carrinho</h1>

      {items.length === 0 && <p>Sem itens para esta loja.</p>}

      {items.map(item => (
        <div className="flex gap-2" key={item.key}>
          <h2>{item.name}</h2>
          <p>Quantidade: {item.quantity}</p>
          <p>Total: {formatBRL(item.total)}</p>
        </div>
      ))}
    </div>
  );
}
