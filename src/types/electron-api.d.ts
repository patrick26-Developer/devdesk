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
      }) => Promise<
        | { ok: true; status: number; statusText: string; headers: Record<string, string>; body: string; timeMs: number }
        | { ok: false; error: string; timeMs: number }
      >;
      getVersion: () => Promise<string>;
      openDataFolder: () => Promise<void>;
    };
  }
}