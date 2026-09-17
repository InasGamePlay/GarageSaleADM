"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PackagePlus, Camera } from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Item = {
  id: string;
  object_name: string;
  owner_name: string;
  sell_price: number;
  photo_url: string | null;
  status: string;
};

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadItems() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("items")
          .select("id, object_name, owner_name, sell_price, photo_url, status")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Erro ao buscar itens:", error.message);
          return;
        }

        setItems(data ?? []);
      } catch (err) {
        console.error("Erro inesperado ao buscar itens:", err);
      } finally {
        setLoading(false);
      }
    }

    loadItems();
  }, []);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Garage</h1>
          <p className="text-sm text-zinc-600">
            Gerencie e encontre objetos perdidos ou à venda.
          </p>
        </header>

        <section aria-label="Ações principais" className="grid gap-3">
          <Link
            href="/cadastrar"
            className="flex items-center justify-center gap-3 rounded-2xl bg-indigo-600 px-6 py-5 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-800"
          >
            <PackagePlus className="h-6 w-6" aria-hidden="true" />
            Cadastrar Novo Objeto
          </Link>

          <Link
            href="/buscar"
            className="flex items-center justify-center gap-3 rounded-2xl border border-zinc-300 bg-white px-6 py-5 text-lg font-semibold text-zinc-800 shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-zinc-200"
          >
            <Camera className="h-6 w-6" aria-hidden="true" />
            Buscar por Foto
          </Link>
        </section>

        <section
          aria-labelledby="catalogo-titulo"
          className="flex flex-col gap-4"
        >
          <h2
            id="catalogo-titulo"
            className="text-lg font-semibold tracking-tight"
          >
            Catálogo de Produtos
          </h2>

          {loading ? (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center gap-2 text-sm text-zinc-600"
            >
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-indigo-600"
                aria-hidden="true"
              />
              Carregando...
            </p>
          ) : items.length === 0 ? (
            <p className="text-sm text-zinc-600">
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            <ul className="flex flex-col gap-3">
              {items.map((item) => (
                <li key={item.id}>
                  <Link
                    href={`/produto/${item.id}`}
                    className="relative flex items-center gap-4 overflow-hidden rounded-2xl border border-zinc-200 bg-white p-3 shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <div className="relative shrink-0">
                      {item.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={item.photo_url}
                          alt={item.object_name}
                          className="h-16 w-16 rounded-xl object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-16 w-16 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400"
                          aria-hidden="true"
                        >
                          <Camera className="h-6 w-6" />
                        </div>
                      )}

                      {item.status === "vendido" && (
                        <span className="absolute inset-x-0 top-0 rounded-t-xl bg-red-600 px-1 py-0.5 text-center text-[10px] font-bold uppercase tracking-wide text-white">
                          Vendido
                        </span>
                      )}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="truncate font-medium">{item.object_name}</h3>
                      <p className="truncate text-sm text-zinc-600">
                        Dono: {item.owner_name}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-indigo-600">
                        {formatPrice(item.sell_price)}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
