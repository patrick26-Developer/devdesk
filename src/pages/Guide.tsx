import { tools } from '@/tools';
import PageHeader from '@/components/PageHeader';
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Target,
} from 'lucide-react';

interface GuideEntry {
  role: string;
  besoin: string;
  usage: string;
}

const GUIDE_CONTENT: Record<string, GuideEntry> = {
  'json-formatter': {
    role: "Valide et met en forme du JSON pour le rendre lisible ou le compacter.",
    besoin: "Un JSON reçu d'une API ou d'un fichier est souvent sur une seule ligne, illisible pour du debug manuel.",
    usage: "Colle ton JSON dans le champ de gauche, clique Formater pour l'indenter ou Minifier pour le compacter sur une ligne.",
  },

  base64: {
    role: "Encode du texte en Base64 ou décode une chaîne Base64 vers du texte lisible.",
    besoin: "Le Base64 est utilisé pour transporter des données binaires dans du texte.",
    usage: "Colle ton texte ou ta chaîne Base64, puis clique Encoder ou Décoder.",
  },

  uuid: {
    role: "Génère des identifiants uniques universels (UUID v4).",
    besoin: "Un UUID permet d'identifier une ressource sans dépendre d'un identifiant central.",
    usage: "Clique Générer puis utilise l'action de copie pour récupérer l'identifiant.",
  },

  regex: {
    role: "Teste une expression régulière contre un texte.",
    besoin: "Tester une regex directement permet d'éviter les allers-retours dans le code.",
    usage: "Saisis ton pattern, tes flags et le texte à tester.",
  },

  timestamp: {
    role: "Convertit un timestamp Unix en date lisible et inversement.",
    besoin: "Les timestamps sont courants dans les API et bases de données mais peu lisibles directement.",
    usage: "Saisis un timestamp ou sélectionne une date pour obtenir la conversion.",
  },

  color: {
    role: "Convertit une couleur entre HEX, RGB et HSL.",
    besoin: "Les projets frontend utilisent différents formats de représentation des couleurs.",
    usage: "Sélectionne une couleur ou saisis un HEX pour obtenir les autres formats.",
  },

  jwt: {
    role: "Décode un token JWT et affiche son header et son payload.",
    besoin: "Inspecter rapidement les informations contenues dans un JWT.",
    usage: "Colle le token complet pour afficher son contenu.",
  },

  hash: {
    role: "Calcule l'empreinte d'un texte avec plusieurs algorithmes.",
    besoin: "Comparer une empreinte permet notamment de vérifier l'intégrité d'une donnée.",
    usage: "Colle ton texte et les différents hashes sont calculés automatiquement.",
  },

  url: {
    role: "Encode ou décode les caractères spéciaux d'une URL.",
    besoin: "Certains caractères doivent être encodés pour être correctement transportés dans une URL.",
    usage: "Colle ton texte puis choisis Encoder ou Décoder.",
  },

  markdown: {
    role: "Édite du Markdown avec un aperçu en temps réel.",
    besoin: "Vérifier rapidement le rendu d'un README ou d'une documentation.",
    usage: "Écris ton Markdown dans l'éditeur et consulte le rendu à côté.",
  },

  lorem: {
    role: "Génère du texte de remplissage.",
    besoin: "Remplir une interface avant d'avoir le contenu final.",
    usage: "Choisis le nombre de paragraphes puis génère le contenu.",
  },

  qrcode: {
    role: "Génère un QR code à partir d'un texte ou d'une URL.",
    besoin: "Partager rapidement une information via un code scannable.",
    usage: "Saisis le contenu puis exporte le QR code si nécessaire.",
  },

  'api-tester': {
    role: "Envoie des requêtes HTTP et affiche leurs réponses.",
    besoin: "Tester rapidement un endpoint API sans quitter DevDesk.",
    usage: "Choisis la méthode, saisis l'URL, configure les données puis envoie la requête.",
  },

  case: {
    role: "Convertit un texte dans toutes les casses courantes (camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE…).",
    besoin: "Passer d'une convention de nommage à une autre sans renommer à la main.",
    usage: "Saisis un identifiant ou une phrase ; chaque casse s'affiche avec un bouton de copie.",
  },

  password: {
    role: "Génère des mots de passe aléatoires cryptographiquement sûrs.",
    besoin: "Créer un secret fort sans dépendre d'un générateur en ligne.",
    usage: "Règle la longueur et les jeux de caractères ; l'entropie estimée s'affiche sous le résultat.",
  },

  contrast: {
    role: "Calcule le ratio de contraste entre deux couleurs et le confronte aux seuils WCAG.",
    besoin: "Vérifier la lisibilité d'un texte pour l'accessibilité (AA / AAA).",
    usage: "Choisis une couleur de texte et une couleur de fond ; les conformités s'affichent avec un aperçu.",
  },

  diff: {
    role: "Compare deux textes ligne à ligne et surligne les ajouts et suppressions.",
    besoin: "Repérer rapidement ce qui a changé entre deux versions d'un contenu.",
    usage: "Colle l'ancienne version à gauche, la nouvelle à droite ; le résultat s'actualise en direct.",
  },

  'number-base': {
    role: "Convertit un entier entre binaire, octal, décimal et hexadécimal.",
    besoin: "Lire une valeur exprimée dans une base et l'obtenir dans les autres.",
    usage: "Saisis un nombre (préfixes 0b / 0o / 0x acceptés) ; la représentation en bits est aussi affichée.",
  },

  'text-utils': {
    role: "Applique des opérations de ligne : tri, déduplication, trim, casse, comptage.",
    besoin: "Nettoyer une liste collée depuis un fichier ou un tableur.",
    usage: "Colle une valeur par ligne puis clique sur une opération ; elle s'applique en place.",
  },

  'json-yaml': {
    role: "Convertit dans les deux sens entre JSON et YAML.",
    besoin: "Passer d'un format de config à l'autre (Docker Compose, Kubernetes, GitHub Actions…).",
    usage: "Colle l'un des formats ; utilise le bouton pour inverser le sens de conversion.",
  },

  cron: {
    role: "Traduit une expression cron en phrase lisible et calcule ses prochaines exécutions.",
    besoin: "Vérifier qu'une planification fait bien ce qu'on croit avant de la déployer.",
    usage: "Saisis les 5 champs (minute heure jour mois jour-semaine) ou choisis un préréglage.",
  },

  'json-to-ts': {
    role: "Génère des interfaces TypeScript à partir d'un objet JSON.",
    besoin: "Typer rapidement une réponse d'API sans écrire les interfaces à la main.",
    usage: "Colle un JSON représentatif ; ajuste le nom de l'interface racine si besoin.",
  },

  'csv-json': {
    role: "Convertit un CSV (avec en-tête) en tableau JSON et inversement.",
    besoin: "Manipuler des données exportées d'un tableur dans du code.",
    usage: "Choisis le délimiteur, colle les données, bascule le sens de conversion au besoin.",
  },

  'string-escape': {
    role: "Échappe ou déséchappe une chaîne pour JSON, HTML, URL, SQL, shell ou regex.",
    besoin: "Insérer un texte dans un contexte qui a ses propres caractères spéciaux.",
    usage: "Choisis la cible, colle ton texte, bascule entre Échapper et Déséchapper.",
  },

  'dotenv-json': {
    role: "Convertit un fichier .env en objet JSON et inversement.",
    besoin: "Importer une config d'environnement dans un outil qui attend du JSON (ou l'inverse).",
    usage: "Colle le contenu ; les commentaires et guillemets du .env sont gérés.",
  },

  'http-status': {
    role: "Référence recherchable des codes de statut HTTP et de leur signification.",
    besoin: "Retrouver rapidement le sens d'un code et quand l'utiliser côté API.",
    usage: "Tape un code, un nom ou un mot-clé pour filtrer la liste.",
  },

  slug: {
    role: "Transforme un texte en slug d'URL : accents retirés, séparateur, longueur maximale.",
    besoin: "Générer des permaliens propres et stables pour des articles ou des pages.",
    usage: "Colle une ou plusieurs lignes ; règle le séparateur et la longueur.",
  },
};

export default function Guide() {
  return (
    <div className="min-h-full p-8">
      <div className="mx-auto max-w-5xl space-y-8">

        <PageHeader
          icon={BookOpen}
          eyebrow="Centre d'aide"
          title="Guide d'utilisation"
          description="Comprends le rôle de chaque outil, le problème qu'il résout et comment l'utiliser efficacement."
        />

        {/* Quick info */}
        <div className="rounded-xl border border-primary/20 bg-primary/[0.04] p-5">
          <div className="flex gap-3">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

            <div>
              <p className="text-sm font-medium">
                Conseil
              </p>

              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Chaque outil a été conçu pour répondre à une tâche précise.
                Consulte sa fiche avant de l'utiliser afin de comprendre
                quand et pourquoi l'utiliser.
              </p>
            </div>
          </div>
        </div>

        {/* Tools */}
        <div className="space-y-3">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            const entry = GUIDE_CONTENT[tool.id];

            return (
              <article
                key={tool.id}
                className="
                  group overflow-hidden rounded-xl border border-border
                  bg-card
                  transition-colors duration-200
                  hover:border-primary/30
                  hover:bg-primary/[0.015]
                "
              >
                {/* Tool header */}
                <div className="flex items-center gap-4 border-b border-border px-5 py-4">
                  <div className="
                    flex h-10 w-10 shrink-0 items-center justify-center
                    rounded-lg bg-muted
                    text-muted-foreground
                    transition-colors duration-200
                    group-hover:bg-primary/10
                    group-hover:text-primary
                  ">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] text-muted-foreground">
                        {String(index + 1).padStart(2, '0')}
                      </span>

                      <h2 className="text-sm font-semibold">
                        {tool.name}
                      </h2>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Guide rapide
                    </p>
                  </div>

                  <ArrowRight className="h-4 w-4 text-muted-foreground/40 transition-colors duration-200 group-hover:text-primary" />
                </div>

                {entry ? (
                  <div className="grid grid-cols-1 gap-0 md:grid-cols-3">

                    {/* Role */}
                    <div className="border-b border-border p-5 md:border-b-0 md:border-r">
                      <div className="mb-3 flex items-center gap-2">
                        <Target className="h-3.5 w-3.5 text-primary" />

                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Rôle
                        </span>
                      </div>

                      <p className="text-xs leading-6 text-muted-foreground">
                        {entry.role}
                      </p>
                    </div>

                    {/* Need */}
                    <div className="border-b border-border p-5 md:border-b-0 md:border-r">
                      <div className="mb-3 flex items-center gap-2">
                        <Lightbulb className="h-3.5 w-3.5 text-amber-500" />

                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Besoin
                        </span>
                      </div>

                      <p className="text-xs leading-6 text-muted-foreground">
                        {entry.besoin}
                      </p>
                    </div>

                    {/* Usage */}
                    <div className="p-5">
                      <div className="mb-3 flex items-center gap-2">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />

                        <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Utilisation
                        </span>
                      </div>

                      <p className="text-xs leading-6 text-muted-foreground">
                        {entry.usage}
                      </p>
                    </div>

                  </div>
                ) : (
                  <div className="p-5">
                    <p className="text-xs text-muted-foreground">
                      Documentation à venir pour cet outil.
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}