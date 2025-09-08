export default function StoreCard({ store }) {
    // Util: "12:34[:56]" -> Date com a data de hoje (horário local)
    const parseTimeToToday = (timeStr) => {
        if (!timeStr) return null;
        const [hh = "00", mm = "00", ss = "00"] = String(timeStr).split(":");
        const now = new Date();
        return new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            Number(hh),
            Number(mm),
            Number(ss)
        );
    };

    // Lida com faixa normal e faixa que cruza a meia-noite (open > close)
    const isOpenNow = (() => {
        if (store?.is_24h) return true; // opcional, caso exista no seu modelo
        const open = parseTimeToToday(store?.open_time);
        const close = parseTimeToToday(store?.close_time);
        if (!open || !close) return false;

        const now = new Date();

        // mesma data (ex.: 08:00–18:00)
        if (open <= close) {
            return now >= open && now < close;
        }

        // cruza meia-noite (ex.: 22:00–02:00)
        // aberto se: agora >= open (ainda no mesmo dia) OU agora < close (madrugada do dia seguinte)
        const closeNextDay = new Date(close.getTime() + 24 * 60 * 60 * 1000);
        return now >= open || now < closeNextDay;
    })();

    const orderTax = Number(store?.order_tax ?? 0);
    const deliveryTime = Number(store?.delivery_time ?? 0);

    return (
        <li className="loja cursor-pointer list-none">
            <a
                href={store?.href || "#"}
                className={`group flex items-stretch gap-3 rounded-2xl border border-gray-200/80 bg-white p-3 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-gray-900/20 ${
                    isOpenNow ? "" : "opacity-70 hover:opacity-100"
                }`}
            >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 md:h-24 md:w-24">
                    {store?.logoUrl ? (
                        <img src={store.logoUrl} alt={store?.name || "Logo"} className="h-full w-full object-cover" />
                    ) : (
                        <div className="absolute inset-0 grid place-items-center text-gray-400">Logo</div>
                    )}
                    <span
                        className={`absolute left-1 top-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold text-white ${
                            isOpenNow ? "bg-emerald-600" : "bg-gray-700"
                        }`}
                    >
                        {isOpenNow ? "Aberto" : "Fechado"}
                    </span>
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div className="min-w-0">
                        <div className="flex justify-center flex-col leading-none">
                            <h3 className="truncate text-base md:text-lg font-semibold text-gray-900 group-hover:underline">
                                {store?.name}
                            </h3>
                            <span className="text-[13px] text-gray-700">{store?.main_category}</span>
                        </div>
                        <p className="mt-0.5 truncate text-sm text-gray-600">{store?.subtitle}</p>
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-700">
                        <span aria-hidden="true">•</span>
                        <span aria-label="Tempo de entrega">
                            <i className="fa-regular fa-clock mr-1" />
                            {Number.isFinite(deliveryTime) ? `${deliveryTime} min` : "—"}
                        </span>
                        <span aria-hidden="true">•</span>
                        <span aria-label="Taxa de entrega">
                            <i className="fa-solid fa-motorcycle mr-1" />
                            {Number.isFinite(orderTax)
                                ? `R$ ${orderTax.toFixed(2).replace(".", ",")}`
                                : "R$ —"}
                        </span>
                    </div>
                </div>
            </a>
        </li>
    );
}
