/**
 * Formata uma data ISO em "dd/mm/aaaa" (pt-BR).
 * Retorna string vazia se o valor for inválido.
 */
export function formatDate(value: string | null | undefined): string {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
