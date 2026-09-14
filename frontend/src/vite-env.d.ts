/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Usa os mocks de cadastro/recuperação em vez da API. Default: "true". */
  readonly VITE_MOCK_AUTH?: string;
  /** Usa o dataset mock de F4 e dashboard em vez da API. Default: "true". */
  readonly VITE_MOCK_API?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
