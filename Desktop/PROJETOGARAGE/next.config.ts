import type { NextConfig } from "next";

// Stub vazio para módulos nativos do Node usados pelo transformers.js.
// No client (WASM), o pacote declara `browser: false` para esses módulos,
// mas o Turbopack resolve isso como `undefined`, quebrando `Object.keys()`
// na inicialização do `env.js`. Aqui forçamos a resolução para um módulo
// que exporta `{}`, mantendo o build do client funcional.
const EMPTY_SHIM = "./lib/shims/empty.mjs";

const nextConfig: NextConfig = {
  // Evita que o transformers.js seja empacotado no bundle do servidor.
  serverExternalPackages: ["@xenova/transformers"],

  turbopack: {
    resolveAlias: {
      fs: { browser: EMPTY_SHIM },
      path: { browser: EMPTY_SHIM },
      url: { browser: EMPTY_SHIM },
      sharp: { browser: EMPTY_SHIM },
      "onnxruntime-node": { browser: EMPTY_SHIM },
    },
  },
};

export default nextConfig;
