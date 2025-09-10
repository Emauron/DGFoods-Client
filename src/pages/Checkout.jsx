import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CartItems from "../components/checkout/CartItems";
import api from "../services/api/api";

export default function Checkout() {
  const { store_id } = useParams();
  const [store, setStore] = useState(null);
  const [loadingStore, setLoadingStore] = useState(true);

  const getStore = async () => {
    try {
      const response = await api.get(`/api/stores/${store_id}`);
      setStore(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingStore(false);
    }
  };

  useEffect(() => {
    getStore();
  }, [store_id]);

  if (loadingStore) {
    return (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
            <div className="h-7 w-48 bg-gray-200 rounded animate-pulse mb-6" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 h-80 bg-white border rounded-2xl shadow-sm animate-pulse" />
                <div className="h-60 bg-white border rounded-2xl shadow-sm animate-pulse" />
            </div>
        </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8 min-h-[85vh]">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
            {store?.name ?? "Loja"}
            </h1>
            <Link
            to={`/store/${store_id}`}
            className="inline-flex items-center rounded-xl border px-3 py-1.5 text-sm hover:bg-gray-50"
            >
            ← Voltar
            </Link>
        </div>

      <CartItems store_id={store_id} />
    </div>
  );
}
