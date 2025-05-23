/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string;
  readonly VITE_BASE_API: string;
  readonly VITE_COMMON_PAGE_SIZE: number;
  readonly VITE_BASE_PATH: string;

  // 更多环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
