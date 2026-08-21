// useEffect : récupère la version de l'app une seule fois au chargement de la page
// useState : stocke cette version pour l'afficher
import { useEffect, useState } from 'react';
// Liste centrale de tous les outils, pour générer dynamiquement la liste affichée ci-dessous
import { tools } from '@/tools';
// Logo de l'application, basé sur ton vrai fichier SVG dans assets/branding
import Logo from '@/components/Logo';
// ExternalLink : icône générique de lien sortant (Github n'existe plus dans lucide-react récent,
// la librairie a retiré ses icônes de marques/logos dans ses versions les plus récentes)
import { ExternalLink } from 'lucide-react';

export default function About() {
  // Version de l'app, vide tant que l'appel IPC n'a pas répondu
  const [version, setVersion] = useState('');

  // Appel IPC vers le main process pour récupérer app.getVersion() (source unique de vérité : package.json)
  useEffect(() => {
    window.api.getVersion().then(setVersion);
  }, []);

  return (
    <div className="max-w-2xl space-y-8 p-8">
      {/* En-tête avec logo et nom de l'application */}
      <div className="flex items-center gap-4">
        <Logo className="h-14 w-14" />
        <div>
          <h2 className="text-lg font-semibold">DevDesk {version && `v${version}`}</h2>
          <p className="text-sm text-muted-foreground">Boîte à outils développeur, 100% locale.</p>
        </div>
      </div>

      {/* Explication de l'utilité de l'app, pour un utilisateur qui découvre le projet */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">À quoi ça sert ?</h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          DevDesk regroupe {tools.length} utilitaires que les développeurs utilisent au quotidien
          (formatage JSON, encodage Base64, génération d'UUID, test de regex, décodage JWT, hash,
          QR codes, client HTTP...) dans une seule application desktop. Contrairement aux équivalents
          en ligne, aucune donnée saisie ne quitte ta machine : tout s'exécute localement, sans connexion
          réseau requise — sauf pour l'outil API Tester, qui appelle uniquement les URLs que tu lui donnes.
        </p>
      </section>

      {/* Liste de tous les outils disponibles, générée dynamiquement depuis le registre central des outils */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Outils disponibles</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
          {tools.map((tool) => (
            <div key={tool.id} className="flex items-center gap-2">
              <tool.icon className="h-3.5 w-3.5" />
              {tool.name}
            </div>
          ))}
        </div>
      </section>

      {/* Stack technique utilisée pour construire l'application */}
      <section className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">Stack technique</h3>
        <p className="text-sm text-muted-foreground">
          Electron, React, TypeScript, Vite, Tailwind CSS, shadcn/ui.
        </p>
      </section>

      {/* Section finale : lien vers le dépôt GitHub et crédit de l'auteur.
          Tout est correctement fermé dans UNE seule section, contrairement à la version précédente. */}
      <section className="space-y-2 border-t border-border pt-4">
        <a
          href="https://github.com/patrick26-Developer/devdesk"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ExternalLink className="h-4 w-4" />
          Code source sur GitHub
        </a>
        <p className="text-xs text-muted-foreground">Développé par Patrick De Grâce MAKOSSO BAYONNE.</p>
      </section>
    </div>
  );
}