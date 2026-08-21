// useState : stocke l'état local (la liste des favoris) et déclenche un re-render quand elle change
// useEffect : exécute du code au montage du composant (ici : charger les favoris une fois au démarrage)
import { useEffect, useState } from 'react';

// Hook personnalisé qui encapsule toute la logique de gestion des favoris.
// N'importe quel composant peut l'utiliser avec : const { favorites, toggleFavorite } = useFavorites();
export function useFavorites() {
  // État local : tableau des IDs d'outils marqués comme favoris. Vide au tout premier rendu.
  const [favorites, setFavorites] = useState<string[]>([]);

  // Au montage du composant (tableau de dépendances vide = exécuté une seule fois),
  // on va chercher les favoris déjà sauvegardés sur disque via l'API exposée par preload.ts
  useEffect(() => {
    window.api.getFavorites().then(setFavorites);
  }, []);

  // Fonction exposée par le hook : bascule un favori et met à jour l'état local
  // avec la réponse renvoyée par le main process (source de vérité = le fichier disque)
  const toggleFavorite = async (toolId: string) => {
    const updated = await window.api.toggleFavorite(toolId);
    setFavorites(updated);
  };

  // Fonction pratique pour savoir si un outil donné est actuellement favori
  const isFavorite = (toolId: string) => favorites.includes(toolId);

  // Le hook renvoie tout ce dont un composant a besoin pour afficher/gérer les favoris
  return { favorites, toggleFavorite, isFavorite };
}