// Import des modules Electron nécessaires : app (cycle de vie), BrowserWindow (fenêtre), ipcMain (écoute des messages du renderer), shell (ouvrir des liens externes)
import { app, BrowserWindow, ipcMain, shell } from 'electron';
// Module Node natif pour manipuler les chemins de fichiers de façon compatible multi-OS
import path from 'node:path';
// Module Node natif pour lire/écrire des fichiers, en version "promises" (async/await au lieu de callbacks)
import fs from 'node:fs/promises';
// Détecte si l'app est lancée via l'installeur Windows Squirrel (création/suppression de raccourcis)
import started from 'electron-squirrel-startup';

// Si l'app vient d'être installée/désinstallée par Squirrel, on quitte immédiatement (comportement normal Windows)
if (started) {
  app.quit();
}

// Construit le chemin complet du fichier où seront stockés les favoris de l'utilisateur.
const favoritesFilePath = path.join(app.getPath('userData'), 'favorites.json');

// Lit le fichier favorites.json et renvoie un tableau d'IDs d'outils favoris
async function readFavorites(): Promise<string[]> {
  try {
    const raw = await fs.readFile(favoritesFilePath, 'utf-8');
    return JSON.parse(raw) as string[];
  } catch {
    return [];
  }
}

// Écrit le tableau de favoris dans le fichier JSON
async function writeFavorites(favorites: string[]): Promise<void> {
  await fs.writeFile(favoritesFilePath, JSON.stringify(favorites, null, 2), 'utf-8');
}

// Type décrivant la forme attendue d'une requête HTTP
interface HttpRequestInput {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: string;
}

// Handler : récupère les favoris
ipcMain.handle('favorites:get', async () => {
  return readFavorites();
});

// Handler : toggle favori
ipcMain.handle('favorites:toggle', async (_event, toolId: string) => {
  const current = await readFavorites();
  const isFavorite = current.includes(toolId);
  const updated = isFavorite
    ? current.filter((id) => id !== toolId)
    : [...current, toolId];
  await writeFavorites(updated);
  return updated;
});

// Handler : vide tous les favoris
ipcMain.handle('favorites:clear', async () => {
  await writeFavorites([]);
  return [];
});

// Handler : exécute une requête HTTP côté main (sans CORS)
ipcMain.handle('http:request', async (_event, input: HttpRequestInput) => {
  const startTime = Date.now();

  try {
    const response = await fetch(input.url, {
      method: input.method,
      headers: input.headers,
      body: ['GET', 'HEAD'].includes(input.method) ? undefined : input.body || undefined,
    });

    const responseBody = await response.text();

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    return {
      ok: true,
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      body: responseBody,
      timeMs: Date.now() - startTime,
    };
  } catch (e) {
    return {
      ok: false,
      error: (e as Error).message,
      timeMs: Date.now() - startTime,
    };
  }
});

// Handler : renvoie la version de l'app
ipcMain.handle('app:getVersion', () => {
  return app.getVersion();
});

// Handler : ouvre le dossier de données locales
ipcMain.handle('app:openDataFolder', async () => {
  await shell.openPath(app.getPath('userData'));
});

// Fonction qui crée la fenêtre principale de DevDesk
const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1200,
    minHeight: 720,
    title: 'DevDesk',
    icon: path.join(process.cwd(), 'assets', 'branding', 'devdesk-icon.png'),
    backgroundColor: '#09090B',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Intercepte l'ouverture de nouvelles fenêtres et redirige vers le navigateur système
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https://') || url.startsWith('http://')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  // Charge l'URL de dev ou le fichier buildé
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`)
    );
  }
};

// Quand Electron est prêt, on crée la fenêtre
app.on('ready', createWindow);

// Quitte l'app quand toutes les fenêtres sont fermées (sauf sur macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Recrée une fenêtre sur macOS si l'icône du dock est cliquée
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});