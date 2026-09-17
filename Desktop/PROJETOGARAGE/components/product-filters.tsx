"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Filtros reutilizáveis de produtos: Status e Ordenação por Data.
 * Atualiza a URL com `searchParams` para preservar o estado entre recargas.
 */
export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const status = searchParams.get("status") ?? "todos";
  const sort = searchParams.get("sort") ?? "desc";

  function handleChange(key: "status" | "sort", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    const isDefault =
      (key === "status" && value === "todos") ||
      (key === "sort" && value === "desc");

    if (isDefault) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, {
      scroll: false,
    });
  }

  const selectClass =
    "w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-800 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <label className="flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-500">Status</span>
        <select
          value={status}
          onChange={(event) => handleChange("status", event.target.value)}
          className={selectClass}
        >
          <option value="todos">Todos</option>
          <option value="disponivel">Disponíveis</option>
          <option value="vendido">Vendidos</option>
        </select>
      </label>

      <label className="flex flex-1 flex-col gap-1.5">
        <span className="text-xs font-medium text-zinc-500">
          Ordenação por Data
        </span>
        <select
          value={sort}
          onChange={(event) => handleChange("sort", event.target.value)}
          className={selectClass}
        >
          <option value="desc">Mais recentes</option>
          <option value="asc">Mais antigos</option>
        </select>
      </label>
    </div>
  );
}
