import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getFavorites: (): Promise<string[]> => ipcRenderer.invoke('favorites:get'),
  toggleFavorite: (toolId: string): Promise<string[]> =>
    ipcRenderer.invoke('favorites:toggle', toolId),
  // Vide tous les favoris d'un coup
  clearFavorites: (): Promise<string[]> => ipcRenderer.invoke('favorites:clear'),
  httpRequest: (input: {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
    timeoutMs?: number;
  }) => ipcRenderer.invoke('http:request', input),
  // API Client : persistance de l'état (collections, environnements, historique)
  apiClientRead: (): Promise<unknown> => ipcRenderer.invoke('apiclient:read'),
  apiClientWrite: (state: unknown): Promise<void> => ipcRenderer.invoke('apiclient:write', state),
  // Récupère le numéro de version affiché dans "À propos"
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
  // Ouvre le dossier de données locales dans l'explorateur de fichiers
  openDataFolder: (): Promise<void> => ipcRenderer.invoke('app:openDataFolder'),
  // Plateforme hôte, pour adapter la barre de titre intégrée
  platform: process.platform,
  // Ajuste la couleur des contrôles de fenêtre (Windows) selon le thème résolu
  setOverlayTheme: (isDark: boolean): Promise<void> =>
    ipcRenderer.invoke('window:setOverlayTheme', isDark),
});
