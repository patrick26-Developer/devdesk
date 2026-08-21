// useEffect : charge la version de l'app une seule fois au montage du composant
// useState : stocke la version récupérée, et un état temporaire pour le feedback visuel du bouton "Réinitialiser"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';

export default function Settings() {
  const { theme } = useTheme();
  const { favorites } = useFavorites();
  // Version de l'app, vide tant qu'elle n'a pas été récupérée depuis le main process
  const [version, setVersion] = useState('');
  // Vrai brièvement après un clic sur "Réinitialiser", pour donner un feedback visuel avant de revenir au texte normal
  const [cleared, setCleared] = useState(false);

  // Récupère la version au chargement de la page (appel IPC vers main.ts)
  useEffect(() => {
    window.api.getVersion().then(setVersion);
  }, []);

  // Ouvre le dossier contenant favorites.json dans l'explorateur natif de l'OS
  const openDataFolder = () => {
    window.api.openDataFolder();
  };

  // Vide tous les favoris, après confirmation explicite (action irréversible)
  const clearFavorites = async () => {
    // confirm() est une boîte de dialogue native bloquante du navigateur, suffisante pour une action simple comme celle-ci
    if (!confirm('Retirer tous les favoris ? Cette action est irréversible.')) return;
    await window.api.clearFavorites();
    setCleared(true);
    // Revient au texte normal du bouton après 1.5s
    setTimeout(() => setCleared(false), 1500);
  };

  return (
    <div className="max-w-2xl space-y-8 p-8">
      <div>
        <h2 className="text-lg font-semibold">Paramètres</h2>
        <p className="text-sm text-muted-foreground">Préférences locales de l'application.</p>
      </div>

      {/* Bloc Apparence */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Apparence</h3>
        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-medium">Thème</p>
            <p className="text-xs text-muted-foreground">
              Actuellement : {theme === 'dark' ? 'Sombre' : 'Clair'}
            </p>
          </div>
          <ThemeToggle />
        </div>
      </section>

      {/* Bloc Données locales */}
      <section className="space-y-3">
        <h3 className="text-sm font-medium text-muted-foreground">Données locales</h3>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-medium">Dossier de données</p>
            <p className="text-xs text-muted-foreground">Contient favorites.json et les données locales de l'app.</p>
          </div>
          <Button variant="secondary" size="sm" onClick={openDataFolder}>
            Ouvrir
          </Button>
        </div>

        <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4">
          <div>
            <p className="text-sm font-medium">Favoris</p>
            <p className="text-xs text-muted-foreground">
              {favorites.length} outil(s) actuellement marqué(s) comme favori.
            </p>
          </div>
          <Button variant="destructive" size="sm" onClick={clearFavorites}>
            {cleared ? 'Effacé ✓' : 'Réinitialiser'}
          </Button>
        </div>
      </section>

      {/* Version, en bas, discrète */}
      <p className="border-t border-border pt-4 text-xs text-muted-foreground">
        DevDesk {version && `v${version}`}
      </p>
    </div>
  );
}