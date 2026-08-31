export {};

declare global {
  interface Window {
    api: {
      getFavorites: () => Promise<string[]>;
      toggleFavorite: (toolId: string) => Promise<string[]>;
      clearFavorites: () => Promise<string[]>;
      httpRequest: (input: {
        url: string;
        method: string;
        headers: Record<string, string>;
        body: string;
        timeoutMs?: number;
      }) => Promise<
        | {
            ok: true;
            status: number;
            statusText: string;
            headers: Record<string, string>;
            body: string;
            timeMs: number;
            sizeBytes: number;
            finalUrl: string;
            redirected: boolean;
          }
        | { ok: false; error: string; timeMs: number }
      >;
      getVersion: () => Promise<string>;
      openDataFolder: () => Promise<void>;
      platform: NodeJS.Platform;
      setOverlayTheme: (isDark: boolean) => Promise<void>;
      apiClientRead: () => Promise<unknown>;
      apiClientWrite: (state: unknown) => Promise<void>;
    };
  }
}
