# DevDesk

Boîte à outils développeur desktop, développée avec Electron, React et TypeScript.

DevDesk regroupe plusieurs utilitaires courants utilisés quotidiennement par les développeurs (formatage JSON, encodage Base64, génération d'UUID, test d'expressions régulières, décodage de JWT, génération de hash, prévisualisation Markdown, génération de QR codes, client HTTP) dans une seule application native, sans dépendance à des services en ligne tiers.

## Objectif du projet

L'ensemble des traitements s'exécute localement, sans transmission de données vers un serveur externe, à l'exception de l'outil de test d'API qui effectue des requêtes HTTP vers les URLs explicitement saisies par l'utilisateur.

Ce projet constitue également une base de référence pour une architecture Electron structurée : séparation stricte entre le processus principal et le processus de rendu, communication sécurisée par IPC via `contextBridge`, persistance locale des préférences utilisateur, et gestion de thème clair/sombre.

## Fonctionnalités

- JSON Formatter : validation et mise en forme de JSON
- Base64 Encoder/Decoder : encodage et décodage Base64 avec support UTF-8
- UUID Generator : génération d'identifiants uniques (UUID v4)
- Regex Tester : test d'expressions régulières avec surlignage des correspondances
- Timestamp Converter : conversion entre timestamp Unix et date lisible
- Color Converter : conversion entre les formats HEX, RGB et HSL
- JWT Decoder : décodage de tokens JWT (header et payload) sans vérification de signature
- Hash Generator : génération de hash SHA-1, SHA-256, SHA-384 et SHA-512
- URL Encoder/Decoder : encodage et décodage de composants d'URL
- Markdown Preview : édition et prévisualisation de Markdown en temps réel
- Lorem Generator : génération de texte de remplissage
- QR Code Generator : génération et export de QR codes au format PNG
- API Tester : client HTTP pour tester des endpoints (méthodes, en-têtes, corps de requête)
- Case Converter : conversion entre camelCase, snake_case, kebab-case, PascalCase, CONSTANT_CASE, etc.
- Password Generator : génération de mots de passe aléatoires (Web Crypto), avec estimation d'entropie
- Contrast Checker : ratio de contraste entre deux couleurs et conformité WCAG (AA / AAA)
- Text Diff : comparaison de deux textes ligne à ligne avec surlignage des différences
- Number Base Converter : conversion d'un entier entre binaire, octal, décimal et hexadécimal
- Text & Line Utilities : tri, déduplication, nettoyage et comptage de lignes
- JSON ↔ YAML : conversion bidirectionnelle entre JSON et YAML
- Cron Explainer : traduction d'une expression cron en français + prochaines exécutions
- JSON to TypeScript : génération d'interfaces TypeScript à partir d'un objet JSON
- CSV ↔ JSON : conversion d'un CSV (avec en-tête) en tableau JSON et inversement
- String Escaper : échappement / déséchappement pour JSON, HTML, URL, SQL, shell, regex
- .env ↔ JSON : conversion d'un fichier .env en objet JSON et inversement
- HTTP Status Codes : référence recherchable des codes de statut HTTP
- Slug Generator : transformation d'un texte en slug d'URL (accents, séparateur, longueur)

L'application inclut également :

- une **analyse du presse-papiers** sur l'accueil : DevDesk devine le type de contenu copié (JSON, JWT, couleur, timestamp, CSV, .env…) et ouvre l'outil adapté, déjà rempli ;
- une **palette de commandes** (Ctrl/Cmd+K) : recherche floue, outils récents, navigation, thème ;
- un système de **favoris** persistés localement, regroupés par catégorie dans la barre latérale ;
- un thème **clair / sombre / système** (suit la préférence de l'OS) ;
- la **persistance des saisies** entre sessions pour les outils à saisie longue ;
- des raccourcis clavier (Ctrl+K palette, Ctrl+B barre latérale, Ctrl+F recherche).

## Stack technique

| Domaine            | Technologie             |
| ------------------ | ----------------------- |
| Framework desktop  | Electron                |
| Outillage de build | Electron Forge, Vite    |
| Interface          | React, TypeScript       |
| Style              | Tailwind CSS, shadcn/ui |
| Icônes            | Lucide React            |

## Prérequis

- Node.js 18 ou supérieur
- npm

## Installation

```bash
git clone https://github.com/patrick26-Developer/devdesk.git
cd devdesk
npm install
```

## Développement

Lance l'application en mode développement, avec rechargement à chaud :

```bash
npm start
```

## Build

Génère les distributables pour la plateforme courante (fichiers d'installation dans `out/make`) :

```bash
npm run make
```

Génère uniquement les fichiers empaquetés, sans créer d'installateur (utile pour un test rapide, résultat dans `out`) :

```bash
npm run package
```

## Structure du projet

devdesk/

├── src/

│   ├── main.ts              Processus principal Electron (fenêtre, IPC, filesystem)

│   ├── preload.ts           Pont sécurisé entre le processus principal et le rendu

│   ├── main.tsx              Point d'entrée du rendu React

│   ├── App.tsx                Composant racine et routage interne

│   ├── components/            Composants partagés (sidebar, logo, thème)

│   ├── pages/                  Pages hors registre d'outils (accueil, paramètres, à propos)

│   ├── tools/                   Un dossier par outil, plus le registre central (index.ts)

│   ├── hooks/                    Hooks personnalisés (favoris, thème)

│   └── types/                     Déclarations de types partagées

├── assets/branding/           Ressources visuelles de l'application

├── forge.config.ts             Configuration Electron Forge

├── vite.main.config.ts         Configuration Vite du processus principal

├── vite.preload.config.ts      Configuration Vite du script preload

└── vite.renderer.config.mts    Configuration Vite du processus de rendu

## Sécurité

L'application applique les pratiques suivantes :

- `contextIsolation` activé et `nodeIntegration` désactivé sur la fenêtre principale
- Communication entre le rendu et le processus principal exclusivement via `contextBridge` et IPC, avec une surface d'API explicitement définie
- Ouverture des liens externes dans le navigateur système plutôt que dans une nouvelle fenêtre Electron
- Aucune donnée utilisateur transmise à un service tiers, hors requêtes explicitement initiées via l'outil de test d'API

## Licence

Distribué sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## Auteur

Patrick De Grâce MAKOSSO BAYONNE
GitHub : [patrick26-Developer](https://github.com/patrick26-Developer)
