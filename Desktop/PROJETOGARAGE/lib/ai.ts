import {
  pipeline,
  type ImageFeatureExtractionPipeline,
} from "@xenova/transformers";

const MODEL_NAME = "Xenova/clip-vit-base-patch32";
const EMBEDDING_DIM = 512;

// Singleton: carrega o modelo apenas uma vez, independente de quantas
// chamadas forem feitas. O modelo é baixado em cache no primeiro uso.
let extractorPromise: Promise<ImageFeatureExtractionPipeline> | null = null;

function getExtractor(): Promise<ImageFeatureExtractionPipeline> {
  if (!extractorPromise) {
    extractorPromise = pipeline(
      "image-feature-extraction",
      MODEL_NAME
    ) as Promise<ImageFeatureExtractionPipeline>;
  }
  return extractorPromise;
}

/** Converte um Blob em data URL (aceito pelo pipeline como entrada de imagem). */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Falha ao ler a imagem."));
    reader.readAsDataURL(blob);
  });
}

/** Normaliza o vetor (norma L2) para que o produto escalar vire cosseno. */
function l2Normalize(vector: number[]): number[] {
  const norm = Math.sqrt(vector.reduce((sum, value) => sum + value * value, 0));
  if (norm === 0) return vector;
  return vector.map((value) => value / norm);
}

/**
 * Gera o embedding (vetor de 512 dimensões) de uma imagem usando o CLIP.
 *
 * @param input - Imagem em Base64 (data URL), Blob ou URL pública.
 * @returns Promise com o vetor normalizado de 512 posições.
 */
export async function getImageEmbedding(
  input: string | Blob
): Promise<number[]> {
  const extractor = await getExtractor();

  const source = typeof input === "string" ? input : await blobToDataUrl(input);

  // O CLIP já possui cabeça de projeção: retorna Tensor com dims [1, 512].
  const output = await extractor(source);

  const vector = Array.from(output.data as Float32Array);

  if (vector.length !== EMBEDDING_DIM) {
    throw new Error(
      `Dimensão inesperada do embedding: esperado ${EMBEDDING_DIM}, recebido ${vector.length}.`
    );
  }

  return l2Normalize(vector);
}
