import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ThemeToggle';
import PageHeader from '@/components/PageHeader';
import { useTheme } from '@/hooks/useTheme';
import { useFavorites } from '@/hooks/useFavorites';
import {
  Palette,
  FolderOpen,
  Star,
  RotateCcw,
  Info,
  Check,
  Monitor,
  HardDrive,
  Database,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export default function Settings() {
  const { theme } = useTheme();
  const { favorites } = useFavorites();

  const [version, setVersion] = useState('');
  const [cleared, setCleared] = useState(false);

  useEffect(() => {
    window.api.getVersion().then(setVersion);
  }, []);

  const openDataFolder = () => {
    window.api.openDataFolder();
  };

  const clearFavorites = async () => {
    if (
      !confirm(
        'Retirer tous les favoris ? Cette action est irréversible.'
      )
    ) {
      return;
    }

    await window.api.clearFavorites();

    setCleared(true);

    setTimeout(() => {
      setCleared(false);
    }, 1500);
  };

  return (
    <div className="min-h-full p-6 xl:p-8">
      <div className="mx-auto max-w-5xl space-y-8">

        <PageHeader
          icon={Palette}
          eyebrow="Configuration"
          title="Paramètres"
          description="Personnalisez votre expérience DevDesk et gérez les données conservées localement sur votre machine."
        />

        {/* =========================================================
            APERÇU / STATUS
        ========================================================= */}
        <section
          className="
            relative
            overflow-hidden
            rounded-2xl
            border
            border-border
            bg-card
            p-6
          "
        >
          {/* Décoration */}
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              h-48
              w-48
              rounded-full
              bg-violet-500/10
              blur-3xl
            "
          />

          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

            {/* Status */}
            <div className="flex items-center gap-4">

              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-emerald-500/15
                  bg-emerald-500/10
                  text-emerald-500
                "
              >
                <ShieldCheck className="h-5 w-5" />
              </div>

              <div>
                <p className="text-sm font-semibold">
                  DevDesk fonctionne localement
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  Vos préférences et favoris restent sur votre machine.
                </p>
              </div>
            </div>

            {/* Version */}
            <div
              className="
                flex
                items-center
                gap-3
                rounded-xl
                border
                border-border
                bg-background/50
                px-4
                py-3
              "
            >
              <Monitor className="h-4 w-4 text-sky-500" />

              <div>
                <p className="text-[11px] text-muted-foreground">
                  Version installée
                </p>

                <p className="mt-0.5 font-mono text-xs font-medium">
                  {version ? `v${version}` : '—'}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            APPARENCE
        ========================================================= */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold">
              Apparence
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Personnalisez l'apparence de votre environnement DevDesk.
            </p>
          </div>

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-card
            "
          >

            {/* THEME */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-5
                p-5
                transition-colors
                duration-200
                hover:bg-accent/40
              "
            >
              <div className="flex min-w-0 items-center gap-4">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-violet-500/15
                    bg-violet-500/10
                    text-violet-500
                  "
                >
                  <Palette className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Thème
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {theme === 'dark'
                      ? 'Mode sombre · Dark Slate'
                      : 'Mode clair · Light'}
                  </p>
                </div>
              </div>

              <ThemeToggle />
            </div>

            {/* CURRENT THEME INFO */}
            <div
              className="
                border-t
                border-border
                bg-muted/20
                px-5
                py-3
              "
            >
              <div className="flex items-center gap-2">

                <div
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-emerald-500
                  "
                />

                <p className="text-[11px] text-muted-foreground">
                  Le thème est appliqué instantanément à toute l'application.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            DONNÉES LOCALES
        ========================================================= */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold">
              Données locales
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Gérez les fichiers et préférences stockés localement par DevDesk.
            </p>
          </div>

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-card
            "
          >

            {/* DATA FOLDER */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-5
                border-b
                border-border
                p-5
                transition-colors
                duration-200
                hover:bg-accent/40
              "
            >
              <div className="flex min-w-0 items-center gap-4">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-cyan-500/15
                    bg-cyan-500/10
                    text-cyan-500
                  "
                >
                  <FolderOpen className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Dossier de données
                  </p>

                  <p className="mt-1 max-w-lg text-xs leading-5 text-muted-foreground">
                    Accédez au dossier contenant les fichiers locaux de
                    l'application, notamment favorites.json.
                  </p>
                </div>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={openDataFolder}
                className="shrink-0 gap-2"
              >
                Ouvrir
                <ChevronRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* FAVORITES */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-5
                p-5
                transition-colors
                duration-200
                hover:bg-accent/40
              "
            >
              <div className="flex min-w-0 items-center gap-4">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-amber-500/15
                    bg-amber-500/10
                    text-amber-500
                  "
                >
                  <Star className="h-4 w-4" />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    Favoris
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {favorites.length === 0
                      ? 'Aucun outil favori actuellement.'
                      : `${favorites.length} outil${
                          favorites.length > 1 ? 's' : ''
                        } actuellement marqué${
                          favorites.length > 1 ? 's' : ''
                        } comme favori.`}
                  </p>
                </div>
              </div>

              <Button
                variant={cleared ? 'secondary' : 'destructive'}
                size="sm"
                onClick={clearFavorites}
                disabled={favorites.length === 0 && !cleared}
                className="shrink-0 gap-1.5"
              >
                {cleared ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Effacé
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3.5 w-3.5" />
                    Réinitialiser
                  </>
                )}
              </Button>
            </div>
          </div>
        </section>

        {/* =========================================================
            RÉSUMÉ DES DONNÉES
        ========================================================= */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold">
              État des données
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Aperçu rapide des données actuellement utilisées par DevDesk.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            {/* FAVORITES STAT */}
            <div
              className="
                rounded-xl
                border
                border-border
                bg-card
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-amber-500/30
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-amber-500/15
                  bg-amber-500/10
                  text-amber-500
                "
              >
                <Star className="h-4 w-4" />
              </div>

              <p className="text-2xl font-semibold">
                {favorites.length}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Outil{favorites.length > 1 ? 's' : ''} favori
                {favorites.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* LOCAL STORAGE */}
            <div
              className="
                rounded-xl
                border
                border-border
                bg-card
                p-5
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:border-cyan-500/30
              "
            >
              <div
                className="
                  mb-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  border
                  border-cyan-500/15
                  bg-cyan-500/10
                  text-cyan-500
                "
              >
                <Database className="h-4 w-4" />
              </div>

              <p className="text-2xl font-semibold">
                Local
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                Stockage des données
              </p>
            </div>
          </div>
        </section>

        {/* =========================================================
            APPLICATION
        ========================================================= */}
        <section>
          <div className="mb-3">
            <h2 className="text-sm font-semibold">
              Application
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Informations relatives à cette installation de DevDesk.
            </p>
          </div>

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-border
              bg-card
            "
          >

            {/* VERSION */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-5
                p-5
                transition-colors
                duration-200
                hover:bg-accent/40
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-violet-500/15
                    bg-violet-500/10
                    text-violet-500
                  "
                >
                  <Info className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Version
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Version actuellement installée sur cette machine.
                  </p>
                </div>
              </div>

              <span
                className="
                  shrink-0
                  rounded-md
                  border
                  border-border
                  bg-muted
                  px-2.5
                  py-1
                  font-mono
                  text-xs
                  text-muted-foreground
                "
              >
                {version ? `v${version}` : '—'}
              </span>
            </div>

            {/* PLATFORM */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-5
                border-t
                border-border
                p-5
                transition-colors
                duration-200
                hover:bg-accent/40
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-sky-500/15
                    bg-sky-500/10
                    text-sky-500
                  "
                >
                  <Monitor className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Application desktop
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    DevDesk est conçu pour fonctionner localement sur desktop.
                  </p>
                </div>
              </div>

              <span
                className="
                  shrink-0
                  rounded-md
                  border
                  border-emerald-500/15
                  bg-emerald-500/10
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-emerald-500
                "
              >
                Local
              </span>
            </div>

            {/* STORAGE */}
            <div
              className="
                flex
                items-center
                justify-between
                gap-5
                border-t
                border-border
                p-5
                transition-colors
                duration-200
                hover:bg-accent/40
              "
            >
              <div className="flex items-center gap-4">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-lg
                    border
                    border-emerald-500/15
                    bg-emerald-500/10
                    text-emerald-500
                  "
                >
                  <HardDrive className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-medium">
                    Stockage
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Les préférences et favoris sont conservés localement.
                  </p>
                </div>
              </div>

              <span
                className="
                  shrink-0
                  rounded-md
                  border
                  border-border
                  bg-muted
                  px-2.5
                  py-1
                  text-[11px]
                  font-medium
                  text-muted-foreground
                "
              >
                Protégé
              </span>
            </div>
          </div>
        </section>

        {/* =========================================================
            FOOTER
        ========================================================= */}
        <footer
          className="
            border-t
            border-border
            pt-5
          "
        >
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-[11px] text-muted-foreground">
              DevDesk conserve ses préférences et favoris localement sur votre
              machine.
            </p>

            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
              Local first
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}