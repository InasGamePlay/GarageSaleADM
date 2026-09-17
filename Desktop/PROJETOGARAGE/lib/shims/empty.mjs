// Stub vazio para módulos nativos do Node (`fs`, `path`, `url`, `sharp`,
// `onnxruntime-node`) quando resolvidos no browser pelo Turbopack.
// O transformers.js só usa esses módulos no ambiente Node; no client
// (WASM), basta que a importação exista e seja "falsy" para `Object.keys`.
const empty = {};

export default empty;
