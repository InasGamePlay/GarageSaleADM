const MAX_EDGE = 1024;
const JPEG_QUALITY = 0.8;

/**
 * Comprime e redimensiona uma imagem no client-side usando Canvas.
 *
 * @param file - Arquivo de imagem original.
 * @returns Blob JPEG comprimido (max 1024px na maior borda).
 */
export async function compressImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);

  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Não foi possível processar a imagem (Canvas indisponível).");
  }

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Falha ao comprimir a imagem."));
      },
      "image/jpeg",
      JPEG_QUALITY
    );
  });

  return blob;
}
