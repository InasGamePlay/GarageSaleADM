"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  ImagePlus,
  Loader2,
  Save,
  User,
  Phone,
  Tag,
} from "lucide-react";
import { getSupabase } from "@/lib/supabase";
import { getImageEmbedding } from "@/lib/ai";
import { compressImage } from "@/lib/compress-image";

type Status =
  | { kind: "idle" }
  | { kind: "comprimindo" }
  | { kind: "uploading" }
  | { kind: "gerando-ia" }
  | { kind: "salvando" }
  | { kind: "erro"; message: string };

const BUCKET_NAME = "photos";

export default function CadastrarPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [objectName, setObjectName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [ownerPhone, setOwnerPhone] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const isBusy = !(
    status.kind === "idle" || status.kind === "erro"
  );

  function handleFileChange(file: File | undefined) {
    if (!file) return;
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  }

  function parsePrice(value: string): number {
    return Number(value.replace(/[^\d.,]/g, "").replace(",", "."));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setStatus({ kind: "erro", message: "Selecione uma foto do objeto." });
      return;
    }

    try {
      // A) Comprimir a imagem no client-side.
      setStatus({ kind: "comprimindo" });
      const compressed = await compressImage(file);

      // B) Upload para o bucket 'photos' e recuperar URL pública.
      setStatus({ kind: "uploading" });
      const supabase = getSupabase();
      const filePath = `${Date.now()}-${crypto.randomUUID()}.jpg`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(filePath, compressed, {
          contentType: "image/jpeg",
          cacheControl: "3600",
        });

      if (uploadError) {
        throw new Error(`Falha no upload da foto: ${uploadError.message}`);
      }

      const { data: publicUrlData } = supabase.storage
        .from(BUCKET_NAME)
        .getPublicUrl(filePath);
      const photoUrl = publicUrlData.publicUrl;

      // C) Gerar o embedding de 512 dimensões com a IA local.
      setStatus({ kind: "gerando-ia" });
      const embedding = await getImageEmbedding(photoUrl);

      // D) Inserir o registro na tabela items.
      setStatus({ kind: "salvando" });
      const { error: insertError } = await supabase.from("items").insert({
        object_name: objectName.trim(),
        owner_name: ownerName.trim(),
        owner_phone: ownerPhone.trim(),
        buy_price: parsePrice(buyPrice),
        sell_price: parsePrice(sellPrice),
        photo_url: photoUrl,
        image_embedding: embedding,
      });

      if (insertError) {
        throw new Error(`Falha ao salvar: ${insertError.message}`);
      }

      router.push("/");
    } catch (error) {
      setStatus({
        kind: "erro",
        message: error instanceof Error ? error.message : "Erro inesperado.",
      });
    }
  }

  const statusLabel: Record<string, string> = {
    comprimindo: "Comprimindo foto...",
    uploading: "Enviando foto...",
    "gerando-ia": "Gerando IA...",
    salvando: "Salvando...",
  };

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
            <h1 className="text-xl font-bold tracking-tight">
              Cadastrar Novo Objeto
            </h1>
            <p className="text-sm text-zinc-600">
              Preencha os dados e envie uma foto.
            </p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="relative flex aspect-video w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-zinc-300 bg-white text-zinc-500 transition-colors hover:border-indigo-400 hover:text-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            {previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="Prévia da foto do objeto"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <>
                <ImagePlus className="h-10 w-10" aria-hidden="true" />
                <span className="px-4 text-center text-sm font-medium">
                  Toque para tirar ou escolher uma foto
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
            onChange={(event) => handleFileChange(event.target.files?.[0])}
          />

          <div className="flex flex-col gap-4">
            <Field
              id="object-name"
              label="Nome do Objeto"
              icon={<Tag className="h-4 w-4" aria-hidden="true" />}
            >
              <input
                id="object-name"
                type="text"
                required
                value={objectName}
                onChange={(event) => setObjectName(event.target.value)}
                placeholder="Ex.: Bicicleta aro 29"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </Field>

            <Field
              id="owner-name"
              label="Nome do Dono"
              icon={<User className="h-4 w-4" aria-hidden="true" />}
            >
              <input
                id="owner-name"
                type="text"
                required
                value={ownerName}
                onChange={(event) => setOwnerName(event.target.value)}
                placeholder="Ex.: João Silva"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </Field>

            <Field
              id="owner-phone"
              label="Telefone do Dono"
              icon={<Phone className="h-4 w-4" aria-hidden="true" />}
            >
              <input
                id="owner-phone"
                type="tel"
                required
                value={ownerPhone}
                onChange={(event) => setOwnerPhone(event.target.value)}
                placeholder="Ex.: (11) 99999-9999"
                className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field
                id="buy-price"
                label="Valor de Compra"
                icon={<Tag className="h-4 w-4" aria-hidden="true" />}
              >
                <input
                  id="buy-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={buyPrice}
                  onChange={(event) => setBuyPrice(event.target.value)}
                  placeholder="0,00"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
              </Field>

              <Field
                id="sell-price"
                label="Valor de Venda"
                icon={<Tag className="h-4 w-4" aria-hidden="true" />}
              >
                <input
                  id="sell-price"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={sellPrice}
                  onChange={(event) => setSellPrice(event.target.value)}
                  placeholder="0,00"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-zinc-400"
                />
              </Field>
            </div>
          </div>

          {status.kind === "erro" && (
            <p
              role="alert"
              className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={isBusy}
            className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 text-base font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                {status.kind in statusLabel
                  ? statusLabel[status.kind]
                  : "Processando..."}
              </>
            ) : (
              <>
                <Save className="h-5 w-5" aria-hidden="true" />
                Salvar
              </>
            )}
          </button>

          <p
            role="status"
            aria-live="polite"
            className="text-center text-xs text-zinc-500"
          >
            {isBusy && status.kind in statusLabel
              ? statusLabel[status.kind]
              : "A foto será analisada por IA local, sem custos de API."}
          </p>
        </form>
      </div>
    </main>
  );
}

type FieldProps = {
  id: string;
  label: string;
  icon: React.ReactNode;
  children: React.ReactNode;
};

function Field({ id, label, icon, children }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-zinc-700">
        {label}
      </label>
      <div className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2.5 focus-within:border-indigo-500 focus-within:ring-2 focus-within:ring-indigo-100">
        <span className="text-zinc-400">{icon}</span>
        {children}
      </div>
    </div>
  );
}
