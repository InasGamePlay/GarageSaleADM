"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  Loader2,
  Phone,
  Sparkles,
  Tag,
  User,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { getImageEmbedding } from "@/lib/ai";

type Match = {
  id: string;
  object_name: string;
  owner_name: string;
  owner_phone: string;
  buy_price: number;
  sell_price: number;
  photo_url: string | null;
  similarity: number;
};

type Status =
  | { kind: "idle" }
  | { kind: "analisando" }
  | { kind: "nenhum" }
  | { kind: "resultados"; matches: Match[] }
  | { kind: "erro"; message: string };

const MATCH_THRESHOLD = 0.75;
const MATCH_COUNT = 3;

export default function BuscarPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const isAnalyzing = status.kind === "analisando";

  async function handlePhotoChange(file: File | undefined) {
    if (!file) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));

    try {
      // A) Gerar o embedding da imagem com a IA local.
      setStatus({ kind: "analisando" });
      const embedding = await getImageEmbedding(file);

      // B) Buscar por similaridade via RPC no Supabase.
      const supabase = getSupabase();
      const { data, error } = await supabase.rpc("match_items", {
        query_embedding: embedding,
        match_threshold: MATCH_THRESHOLD,
        match_count: MATCH_COUNT,
      });

      if (error) {
        throw new Error(`Falha na busca: ${error.message}`);
      }

      const matches = (data ?? []) as Match[];

      // C/D) Exibir resultados ou mensagem de vazio.
      setStatus(
        matches.length > 0
          ? { kind: "resultados", matches }
          : { kind: "nenhum" }
      );
    } catch (error) {
      setStatus({
        kind: "erro",
        message: error instanceof Error ? error.message : "Erro inesperado.",
      });
    }
  }

  const formatPrice = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  const formatSimilarity = (value: number) =>
    `${(value * 100).toFixed(0)}%`;

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
            <h1 className="text-xl font-bold tracking-tight">Buscar por Foto</h1>
            <p className="text-sm text-zinc-600">
              Tire uma foto e encontre objetos parecidos.
            </p>
          </div>
        </header>

        <section aria-label="Captura de foto" className="flex flex-col gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isAnalyzing}
            className="relative flex aspect-video w-full flex-col items-center justify-center gap-3 overflow-hidden rounded-3xl bg-indigo-600 text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Foto tirada para busca"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <Camera className="h-12 w-12" aria-hidden="true" />
                <span className="px-4 text-lg font-semibold">
                  Tirar Foto do Objeto
                </span>
              </>
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            onChange={(event) => handlePhotoChange(event.target.files?.[0])}
          />

          {isAnalyzing && (
            <p
              role="status"
              aria-live="polite"
              className="flex items-center justify-center gap-2 text-sm text-zinc-600"
            >
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Analisando imagem...
            </p>
          )}

          {status.kind === "erro" && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {status.message}
            </p>
          )}
        </section>

        {status.kind === "resultados" && (
          <section
            aria-labelledby="matches-titulo"
            className="flex flex-col gap-4"
          >
            <h2
              id="matches-titulo"
              className="flex items-center gap-2 text-lg font-semibold tracking-tight"
            >
              <Sparkles className="h-5 w-5 text-indigo-600" aria-hidden="true" />
              Matches Encontrados!
            </h2>

            <ul className="flex flex-col gap-3">
              {status.matches.map((match) => (
                <li key={match.id}>
                  <Link
                    href={`/produto/${match.id}`}
                    className="block overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-colors hover:bg-zinc-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    <div className="relative">
                      {match.photo_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={match.photo_url}
                          alt={match.object_name}
                          className="h-44 w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-44 w-full items-center justify-center bg-zinc-100 text-zinc-400">
                          <Camera className="h-8 w-8" aria-hidden="true" />
                        </div>
                      )}
                      <span className="absolute right-3 top-3 rounded-full bg-indigo-600 px-3 py-1 text-sm font-semibold text-white shadow-sm">
                        {formatSimilarity(match.similarity)} similar
                      </span>
                    </div>

                    <div className="flex flex-col gap-2 p-4">
                      <h3 className="font-medium">{match.object_name}</h3>

                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <User className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                        <span className="truncate">{match.owner_name}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-zinc-600">
                        <Phone className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                        <span>{match.owner_phone}</span>
                      </div>

                      <div className="mt-1 flex items-center gap-4 border-t border-zinc-100 pt-3">
                        <div className="flex items-center gap-1.5 text-sm text-zinc-500">
                          <Tag className="h-4 w-4" aria-hidden="true" />
                          <span>Compra:</span>
                          <span className="font-semibold text-zinc-700">
                            {formatPrice(match.buy_price)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm">
                          <Tag className="h-4 w-4 text-indigo-500" aria-hidden="true" />
                          <span>Venda:</span>
                          <span className="font-semibold text-indigo-600">
                            {formatPrice(match.sell_price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {status.kind === "nenhum" && (
          <section className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white px-6 py-10 text-center shadow-sm">
            <Camera className="h-10 w-10 text-zinc-300" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Nenhum item similar encontrado</h2>
            <p className="text-sm text-zinc-600">
              Não encontramos objetos parecidos com essa foto. Tente novamente
              com outro ângulo ou iluminação.
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Tentar outra foto
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
