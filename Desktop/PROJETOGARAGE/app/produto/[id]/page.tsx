"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Phone,
  Tag,
  Trash2,
  User,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";

type Item = {
  id: string;
  object_name: string;
  owner_name: string;
  owner_phone: string;
  buy_price: number;
  sell_price: number;
  photo_url: string | null;
  status: string;
};

/** Remove tudo que não for dígito, deixando apenas os números do telefone. */
function cleanPhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export default function ProdutoPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadItem() {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("items")
          .select(
            "id, object_name, owner_name, owner_phone, buy_price, sell_price, photo_url, status"
          )
          .eq("id", id)
          .single();

        if (error) {
          setNotFound(true);
          return;
        }

        setItem(data as Item);
      } catch (err) {
        console.error("Erro inesperado ao buscar item:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    if (id) loadItem();
  }, [id]);

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const isSold = item?.status === "vendido";

  async function handleMarkAsSold() {
    if (!item) return;

    setUpdating(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("items")
        .update({ status: "vendido" })
        .eq("id", item.id);

      if (error) throw new Error(`Falha ao atualizar: ${error.message}`);

      setItem({ ...item, status: "vendido" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
    } finally {
      setUpdating(false);
    }
  }

  async function handleDelete() {
    if (!item) return;

    const confirmed = window.confirm(
      "Tem certeza que deseja excluir este produto? Essa ação não pode ser desfeita."
    );
    if (!confirmed) return;

    setDeleting(true);
    setError(null);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from("items")
        .delete()
        .eq("id", item.id);

      if (error) throw new Error(`Falha ao excluir: ${error.message}`);

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro inesperado.");
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-4 py-6">
          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" aria-hidden="true" />
          <p role="status" aria-live="polite" className="text-sm text-zinc-600">
            Carregando...
          </p>
        </div>
      </main>
    );
  }

  if (notFound || !item) {
    return (
      <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-6 text-center">
          <p className="text-lg font-semibold">Produto não encontrado</p>
          <p className="text-sm text-zinc-600">
            Este item pode ter sido removido.
          </p>
          <Link
            href="/"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Voltar para a Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-4 py-6">
        <header className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-600 shadow-sm transition-colors hover:bg-zinc-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            aria-label="Voltar para a página inicial"
          >
            <ArrowLeft className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">Detalhes do Produto</h1>
            <p className="text-sm text-zinc-600">{item.object_name}</p>
          </div>
        </header>

        <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="relative">
            {item.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={item.photo_url}
                alt={item.object_name}
                className="h-72 w-full object-cover"
              />
            ) : (
              <div className="flex h-72 w-full items-center justify-center bg-zinc-100 text-zinc-400">
                <Camera className="h-12 w-12" aria-hidden="true" />
              </div>
            )}

            <span
              className={`absolute left-3 top-3 rounded-full px-3 py-1 text-sm font-semibold text-white shadow-sm ${
                isSold ? "bg-red-600" : "bg-emerald-600"
              }`}
            >
              {isSold ? "Vendido" : "Disponível"}
            </span>
          </div>

          <div className="flex flex-col gap-3 p-5">
            <h2 className="text-xl font-bold">{item.object_name}</h2>

            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <User className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              <span>Dono: {item.owner_name}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-zinc-600">
              <Phone className="h-4 w-4 text-zinc-400" aria-hidden="true" />
              <a
                href={`https://wa.me/55${cleanPhone(item.owner_phone)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 underline-offset-2 transition-colors hover:text-emerald-700 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600"
              >
                {item.owner_phone}
              </a>
            </div>

            <div className="mt-1 grid grid-cols-2 gap-3 border-t border-zinc-100 pt-4">
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Tag className="h-4 w-4" aria-hidden="true" />
                  Compra
                </span>
                <span className="text-lg font-semibold text-zinc-700">
                  {formatPrice(item.buy_price)}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-1.5 text-sm text-zinc-500">
                  <Tag className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                  Venda
                </span>
                <span className="text-lg font-semibold text-indigo-600">
                  {formatPrice(item.sell_price)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <p
            role="alert"
            className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <section aria-label="Ações" className="flex flex-col gap-3">
          {!isSold && (
            <button
              type="button"
              onClick={handleMarkAsSold}
              disabled={updating || deleting}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updating ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
              )}
              {updating ? "Atualizando..." : "Marcar como Vendido"}
            </button>
          )}

          <button
            type="button"
            onClick={handleDelete}
            disabled={updating || deleting}
            className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:bg-red-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            ) : (
              <Trash2 className="h-5 w-5" aria-hidden="true" />
            )}
            {deleting ? "Excluindo..." : "Excluir Produto"}
          </button>
        </section>
      </div>
    </main>
  );
}
