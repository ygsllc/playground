/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_MAX_MESSAGE_LENGTH: string
  readonly VITE_API_URL: string
  readonly VITE_API_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
} 