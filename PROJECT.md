# DevDesk — Journal de projet

> Boîte à outils développeur desktop (Electron + React + TypeScript), 100 % locale.
> Ce fichier centralise l'état du projet, les décisions, la feuille de route et le journal des versions.

---

## 1. Vue d'ensemble

DevDesk regroupe les utilitaires du quotidien d'un développeur dans une seule application
native, sans dépendre de services en ligne. Deux grands axes :

| Axe | Contenu |
|---|---|
| **Utilitaires** | 26 outils autonomes (format, encodage, hash, conversion, texte, web…) |
| **API Client** | Environnement de test/développement d'API intégré (en construction — voir §4) |

Principes : traitement local, aucune télémétrie, architecture Electron stricte
(process principal / rendu séparés, IPC par `contextBridge`).

---

## 2. Architecture

```
src/
├── main.ts                 Process principal : fenêtre, IPC (favoris, http, fichiers, api-client)
├── preload.ts              Pont sécurisé renderer ↔ main (window.api)
├── App.tsx                 Racine + routage interne + barre utilitaire (drag region)
├── components/             Composants partagés (Sidebar, ToolShell, CopyButton, SmartPaste…)
│   └── tool/               Primitives d'outil : ToolShell, Panel, EmptyState
├── pages/                  Accueil, Guide, Paramètres, À propos
├── tools/
│   ├── index.ts            Registre central (id, nom, description, icône, catégorie, mots-clés)
│   ├── categories.ts       6 catégories + couleurs d'accent
│   ├── <outil>/            Un dossier par outil
│   └── api-client/         L'API Client (sous-app : store, runtime, panneaux…)
├── hooks/                  useTheme, useFavorites, usePersistentState
└── lib/                    utils, notify (toasts), detect (analyse presse-papiers)
```

**Conventions**
- Chaque outil est un composant monté par `ToolShell` (en-tête unifié, padding normalisé).
- Métadonnées d'un outil = une entrée dans `src/tools/index.ts`. Rien d'autre à câbler.
- Saisies persistées via `usePersistentState('<outil>:<champ>', défaut)` (localStorage).
- Notifications via `notify()` de `src/lib/notify.ts`.

---

## 3. Feuille de route

### Refonte UI/UX (terminée — branche `feat/ui-ux-overhaul`)

| Phase | État | Résumé |
|---|---|---|
| 0 | ✅ | Registre enrichi (catégories, description, mots-clés) |
| 1 | ✅ | `ToolShell` commun, fin du double en-tête, 13 outils unifiés |
| 2 | ✅ | Palette de commandes (Ctrl+K), toasts, sidebar par catégories, favoris, thème système |
| 3 | ✅ | Durcissement visuel (accent unique, halos retirés, CSS mort) |
| 4 | ✅ | 6 outils : casse, mot de passe, contraste WCAG, diff, base numérique, lignes |
| 5 | ✅ | 8 outils : JSON↔YAML, cron, JSON→TS, CSV↔JSON, échappement, .env↔JSON, statuts HTTP, slug + SmartPaste |
| 6 | ✅ | Barre de titre intégrée (frameless) |

### API Client — "API Testing Workbench" (en cours)

Objectif : développer et tester son propre backend sans revenir à Postman.

```
        ┌──────────── DEV DESK / API CLIENT ────────────┐
        │                                               │
   WORKSPACE            REQUEST                 TESTING
   Collections          Method / URL            Assertions
   Environments         Params / Headers        Scripts pre/post
   Variables            Auth                     Extraction de variables
   History              Body (JSON/form/GraphQL) Runner + rapports
```

| Phase | État | Contenu |
|---|---|---|
| **A — Cœur client + variables + tests + import** | ✅ | Request builder à onglets (Params/Headers/Auth/Body/Pré-script/Tests/Extraction), environnements + variables `{{VAR}}` + variables dynamiques `{{$guid}}`…, auth Bearer/Basic/API Key/hérité, corps JSON/texte/form/urlencoded/GraphQL, Response viewer (Pretty/Raw/Headers/Tests + filtre + statut/temps/taille), historique (100), collections (arbre, dossiers, enregistrer/renommer/dupliquer/supprimer), moteur de tests `pm`-like + `pm.expect`, extraction déclarative de variables → env, Collection Runner + rapport, import OpenAPI/Swagger (JSON ou YAML), persistance fichier (`userData/api-client.json`) |
| **B — Confort** | ⬜ | Import/export cURL, onglets multiples, GraphQL variables, téléchargement de réponse, cookies |
| **C — Avancé (plus tard)** | ⬜ | Mock server, monitors, WebSocket/gRPC, workflows visuels, assistant IA, documentation générée |

**Le blocage actuel de l'utilisateur** (copier-coller manuel du token entre `/login` et
`/users`) est résolu dès la Phase A : environnement `Local`, variable `{{accessToken}}`,
règle d'extraction post-réponse `accessToken ← $.accessToken`, auth `Bearer {{accessToken}}`.

---

## 4. Journal des versions

### `feat/ui-ux-overhaul` — 2026-08-31

- **389fdda** Registre d'outils enrichi (catégories, description, mots-clés).
- **1031ffd** Socle `ToolShell` + `Panel`/`CopyButton`/`EmptyState`/`PageHeader` ; 13 outils
  migrés ; en-tête global allégé ; raccourcis revus (Ctrl+B = sidebar).
- **e255de5** Palette de commandes Ctrl+K, toasts (`notify`), `AlertDialog` dans Paramètres,
  sidebar groupée par catégories + section Favoris, thème tri-état clair/système/sombre,
  store favoris partagé, persistance des saisies.
- **e50bf0b** Durcissement visuel : halos flous retirés, accent unique, CSS mort supprimé,
  `tabular-nums`, découpage des chunks Vite.
- **2310762** 6 outils : Case Converter, Password Generator, Contrast Checker, Text Diff,
  Number Base Converter, Text & Line Utilities.
- **3dca6c3** Fix palette : Ctrl+K ouvre toujours, fermeture Échap garantie.
- **f52e4eb** 8 outils (JSON↔YAML, Cron Explainer, JSON→TS, CSV↔JSON, String Escaper,
  .env↔JSON, HTTP Status Codes, Slug) + SmartPaste (analyse du presse-papiers) +
  `PasteButton`. 19 → 27 outils. Dépendances : `yaml`, `cronstrue`.
- **67c9db1** Barre de titre intégrée (frameless) : `titleBarOverlay` (Windows) /
  `hiddenInset` (macOS), zones de déplacement, couleur des contrôles suit le thème.

### API Client — 2026-08-31 (suite)

- Transformation de l'outil « API Tester » en **API Client** complet
  (`src/tools/api-client/`) : store persisté fichier, résolution de variables,
  runtime (build requête + scripts + tests + extraction), request builder à onglets,
  response viewer, workspace (collections + historique), environnements, runner,
  import OpenAPI/Swagger. IPC `apiclient:read`/`apiclient:write` ;
  `http:request` enrichi (taille, URL finale, redirection, timeout).
- `PROJECT.md` : ce journal.

---

## 5. Notes techniques

- **TypeScript 4.5.4** : trop ancien pour `tsc --noEmit` (échoue sur des `.d.ts` de
  `node_modules`). La validation passe par `vite build` (esbuild).
- **Build** : `vite build --config vite.renderer.config.mts` ~2 min. `npm run package`
  produit `out/` (lent : dépendances natives + finalisation).
- **Chunks** : `react`, `parsers` (yaml/marked/dompurify/cronstrue), `vendor`
  (qrcode/cmdk/lucide) séparés. App chargée en `file://` → taille sans impact réseau.
- **Requêtes HTTP** : exécutées dans le process principal (`ipcMain http:request`) pour
  contourner CORS. Retourne statut, en-têtes, corps, durée, taille.
