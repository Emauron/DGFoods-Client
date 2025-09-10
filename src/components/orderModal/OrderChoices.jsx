// -----------------------------------------------
// OrderChoices.jsx
import { useState, useEffect, useMemo, useRef } from "react";
import api from "../../services/api/api";

/**
 * Este componente calcula APENAS o ajuste do seu grupo:
 * lineItemsAdj = Σ (qty[optionId] * price_adj_da_opção)
 * e notifica o pai via setPriceAdj(lineItemsAdj).
 * Além disso, agora escreve em setOrderProduct(prev => ({
 *   ...prev,
 *   optionGroups: { ...prev.optionGroups, [groupId]: [ ...opções selecionadas ] }
 * }))
 */
export default function OrderChoices({ optionGroup, setPriceAdj, value, onChange, setOrderProduct }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(value ?? {});

  const toNumber = (v) => {
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    if (v == null || v === "") return 0;
    const n = Number(String(v).replace(",", "."));
    return Number.isFinite(n) ? n : 0;
  };

  const selectionType = optionGroup?.selection_type ?? "single";
  const rawMax =
    optionGroup?.max_choice ?? optionGroup?.default_max ?? (selectionType === "single" ? 1 : 0);
  const rawMin = optionGroup?.min_choice ?? optionGroup?.default_min ?? 0;

  const isUnlimited = selectionType === "multiple" && (!rawMax || Number(rawMax) <= 0);
  const effectiveMax = selectionType === "single" ? 1 : isUnlimited ? Infinity : Number(rawMax);
  const effectiveMin = Number(rawMin) || 0;

  // ressincroniza valor controlado externo
  useEffect(() => {
    if (value && typeof value === "object") setQty(value);
  }, [value]);

  // carrega as opções do grupo
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/products/options/${optionGroup.id}`);
        if (!alive) return;
        setOptions(Array.isArray(res.data) ? res.data : []);
      } catch (e) {
        console.error(e);
        setOptions([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    if (!value) setQty({});
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [optionGroup?.id]);

  // total selecionado (para validar min/max)
  const total = useMemo(
    () => Object.values(qty).reduce((a, b) => a + (Number(b) || 0), 0),
    [qty]
  );
  const remaining = isUnlimited ? Infinity : Math.max(0, effectiveMax - total);

  // soma dos ajustes dos itens (qty * price_adj)
  const lineItemsAdj = useMemo(() => {
    if (!Array.isArray(options) || options.length === 0) return 0;
    return options.reduce((acc, opt) => {
      const q = toNumber(qty?.[opt.id] ?? 0);
      const adj = toNumber(opt?.price_adj ?? 0);
      return acc + q * adj;
    }, 0);
  }, [options, qty]);

  // evita loop de renderização ao não depender da identidade da função
  const setPriceAdjRef = useRef(setPriceAdj);
  useEffect(() => { setPriceAdjRef.current = setPriceAdj; }, [setPriceAdj]);

  // envia APENAS o ajuste deste grupo quando o valor mudar
  useEffect(() => {
    if (typeof setPriceAdjRef.current === "function") {
      setPriceAdjRef.current(lineItemsAdj);
    }
  }, [lineItemsAdj]);

  // ---- NOVO: escreve as seleções do grupo dentro do produto do pai ----
  const buildSelected = (qtyObj, opts) =>
    opts
      .filter((o) => toNumber(qtyObj?.[o.id]) > 0)
      .map((o) => ({
        id: o.id,
        name: o.name,
        quantity: toNumber(qtyObj[o.id]),
        priceAdj: toNumber(o.price_adj ?? 0),
      }));

  useEffect(() => {
    if (typeof setOrderProduct !== "function") return;
    const selected = buildSelected(qty, options);
    setOrderProduct((prev) => ({
      ...prev,
      optionGroups: {
        ...(prev?.optionGroups ?? {}),
        [optionGroup.id]: selected,
      },
    }));
  }, [qty, options, optionGroup?.id, setOrderProduct]);
  // ---------------------------------------------------------------------

  const emit = (next) => {
    setQty(next);
    onChange?.(optionGroup.id, next);
  };

  const setQuantity = (id, nextVal) => {
    let next = Math.max(0, Number.isFinite(+nextVal) ? Math.floor(+nextVal) : 0);

    if (selectionType === "single") {
      const obj = {};
      obj[id] = next > 0 ? 1 : 0;
      return emit(obj);
    }

    const current = qty[id] || 0;
    const delta = next - current;
    if (!isUnlimited && delta > 0) {
      next = current + Math.min(delta, remaining);
    }
    emit({ ...qty, [id]: next });
  };

  const inc = (id) => setQuantity(id, (qty[id] || 0) + 1);
  const dec = (id) => setQuantity(id, (qty[id] || 0) - 1);

  if (loading) return <div>Loading...</div>;
  if (!options.length) return <div>No choices found</div>;

  return (
    <div className="w-full justify-center">
      <div className="flex items-center justify-between px-1">
        <span className="text-sm text-gray-600">
          {selectionType === "single" ? (
            "Escolha uma opção"
          ) : (
            <>
              Selecionados: <strong>{total}</strong>
              {!isUnlimited && (
                <>
                  {" "}de <strong>{effectiveMax}</strong>
                </>
              )}
              {effectiveMin > 0 && (
                <span className="mx-2 text-xs text-gray-500">(mín. {effectiveMin})</span>
              )}
            </>
          )}
        </span>
      </div>

      <div className="space-y-2 w-full">
        {options.map((opt) => {
          const q = qty[opt.id] || 0;
          const plusDisabled = selectionType === "single" ? q >= 1 : !isUnlimited && remaining <= 0;
          const minusDisabled = q <= 0;

          const adjNum = toNumber(opt.price_adj);
          const adjAbs = Math.abs(adjNum).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
            minimumFractionDigits: 2,
          });
          const adjLabel = adjNum !== 0 ? `${adjNum > 0 ? "+ " : "- "}${adjAbs}` : "sem acréscimo";

          return (
            <div key={opt.id} className="flex items-center justify-between p-3 border rounded-lg mx-3">
              <div className="min-w-0 pr-3">
                <div className="font-medium text-gray-800 truncate">{opt.name}</div>
                <div className="text-xs text-gray-500">{adjLabel}</div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  className={`px-3 py-1 rounded border ${minusDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}`}
                  onClick={() => dec(opt.id)}
                  disabled={minusDisabled}
                  aria-label={`Diminuir ${opt.name}`}
                >
                  –
                </button>

                <input
                  type="number"
                  min={0}
                  step={1}
                  className="w-16 text-center border rounded py-1"
                  value={q}
                  onChange={(e) => setQuantity(opt.id, e.target.value)}
                />

                <button
                  type="button"
                  className={`px-3 py-1 rounded border ${plusDisabled ? "opacity-40 cursor-not-allowed" : "hover:bg-gray-50"}`}
                  onClick={() => inc(opt.id)}
                  disabled={plusDisabled}
                  aria-label={`Aumentar ${opt.name}`}
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {!isUnlimited && selectionType === "multiple" && remaining === 0 && (
        <p className="text-xs text-gray-500 px-1">Você atingiu o máximo permitido para este grupo.</p>
      )}
    </div>
  );
}
