// Store externe partagé pour les favoris : toutes les instances de useFavorites()
// (sidebar, paramètres, palette de commandes...) voient le même état et se
// re-rendent ensemble. La source de vérité reste le fichier disque géré par le main process.
import { useCallback, useSyncExternalStore } from 'react';

let favorites: string[] = [];
let loaded = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

async function load() {
  favorites = await window.api.getFavorites();
  loaded = true;
  emit();
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  if (!loaded) load();
  return () => {
    listeners.delete(callback);
  };
}

function getSnapshot() {
  return favorites;
}

export function useFavorites() {
  const favs = useSyncExternalStore(subscribe, getSnapshot);

  const toggleFavorite = useCallback(async (toolId: string) => {
    favorites = await window.api.toggleFavorite(toolId);
    emit();
  }, []);

  const clearFavorites = useCallback(async () => {
    favorites = await window.api.clearFavorites();
    emit();
  }, []);

  const isFavorite = useCallback((toolId: string) => favs.includes(toolId), [favs]);

  return { favorites: favs, toggleFavorite, clearFavorites, isFavorite };
}
