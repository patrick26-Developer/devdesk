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
  }) => ipcRenderer.invoke('http:request', input),
  // Récupère le numéro de version affiché dans "À propos"
  getVersion: (): Promise<string> => ipcRenderer.invoke('app:getVersion'),
  // Ouvre le dossier de données locales dans l'explorateur de fichiers
  openDataFolder: (): Promise<void> => ipcRenderer.invoke('app:openDataFolder'),
});