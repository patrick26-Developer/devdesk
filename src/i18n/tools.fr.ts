// Descriptions d'outils + contenu du guide, en français (source).
// Le guide utilise 5 champs par outil : role, need, steps (étapes séparées par \n),
// details (ce qui s'applique / options / limites), tip (astuce facultative, '' si absente).
export const toolsFr: Record<string, string> = {
  'tool.json-formatter.desc': 'Formatez, minifiez et validez rapidement votre JSON.',
  'tool.base64.desc': 'Encodez ou décodez rapidement une chaîne Base64.',
  'tool.uuid.desc': 'Génère des identifiants UUID v4 uniques et aléatoires.',
  'tool.regex.desc': 'Teste et visualise tes expressions régulières en temps réel.',
  'tool.timestamp.desc': 'Convertis des timestamps Unix en dates lisibles et inversement.',
  'tool.color.desc': 'Convertissez une couleur entre HEX, RGB et HSL.',
  'tool.jwt.desc': "Analysez localement le header et le payload d'un token JWT.",
  'tool.hash.desc': "Générez plusieurs empreintes cryptographiques à partir d'un texte.",
  'tool.url.desc': 'Encode ou décode rapidement des URLs et des paramètres.',
  'tool.markdown.desc': 'Écrivez du Markdown et visualisez instantanément son rendu.',
  'tool.lorem.desc': 'Générez du texte fictif pour vos maquettes et prototypes.',
  'tool.qrcode.desc': 'Transformez une URL ou un texte en QR Code exportable.',
  'tool.api-tester.desc': "Atelier d'API : environnements, collections, variables, tests, runner.",
  'tool.case.desc': 'Convertit un texte entre camelCase, snake_case, kebab-case…',
  'tool.password.desc': 'Génère des mots de passe aléatoires forts, en local.',
  'tool.contrast.desc': 'Vérifie le contraste de deux couleurs selon les critères WCAG.',
  'tool.diff.desc': 'Compare deux textes ligne à ligne et surligne les différences.',
  'tool.number-base.desc': 'Convertit un entier entre binaire, octal, décimal et hexadécimal.',
  'tool.text-utils.desc': 'Trie, déduplique, nettoie et compte des lignes de texte.',
  'tool.json-yaml.desc': 'Convertit dans les deux sens entre JSON et YAML.',
  'tool.cron.desc': 'Explique une expression cron et liste ses prochaines exécutions.',
  'tool.json-to-ts.desc': "Génère des interfaces TypeScript à partir d'un objet JSON.",
  'tool.csv-json.desc': 'Convertit un CSV en tableau JSON et inversement.',
  'tool.string-escape.desc': 'Échappe / déséchappe pour JSON, HTML, URL, SQL, shell, regex.',
  'tool.dotenv-json.desc': 'Convertit un fichier .env en JSON et inversement.',
  'tool.http-status.desc': 'Référence recherchable des codes de statut HTTP et leur usage.',
  'tool.slug.desc': "Transforme un texte en slug d'URL (accents, séparateur, longueur).",

  // ─── JSON Formatter ───────────────────────────────────────────────
  'guide.json-formatter.role':
    "Analyse un document JSON, le met en forme avec une indentation de 2 espaces ou le compacte sur une seule ligne, et signale précisément la première erreur de syntaxe.",
  'guide.json-formatter.need':
    "Un JSON renvoyé par une API ou copié depuis un log arrive souvent sur une seule ligne, illisible pour une vérification manuelle. À l'inverse, avant de le coller dans un fichier de configuration on veut parfois le compacter.",
  'guide.json-formatter.steps':
    "Collez ou saisissez le JSON dans le panneau « Entrée » (bouton Coller pour récupérer le presse-papiers).\nCliquez « Formater » pour l'indenter, ou « Minifier » pour le réduire à une ligne.\nLe panneau « Résultat » affiche la sortie ; l'icône de copie la place dans le presse-papiers.\nEn cas d'erreur, le message exact (position incluse) apparaît sous les panneaux.",
  'guide.json-formatter.details':
    "Le parseur est le JSON.parse natif : les commentaires, les virgules finales et les clés non entre guillemets sont refusés. L'ordre des clés, les nombres et l'encodage Unicode sont préservés. Tout est traité en mémoire, rien n'est envoyé.",
  'guide.json-formatter.tip':
    "Sur l'Accueil, « Analyser le presse-papiers » détecte le JSON et ouvre cet outil déjà rempli.",

  // ─── Markdown Preview ─────────────────────────────────────────────
  'guide.markdown.role':
    "Éditeur Markdown avec rendu HTML en direct, nettoyé avant affichage. Le bouton « HTML » copie le code généré.",
  'guide.markdown.need':
    "Vérifier le rendu d'un README, d'une description de ticket ou d'un commentaire long avant de le publier.",
  'guide.markdown.steps':
    "Écrivez le Markdown dans l'éditeur de gauche.\nLe panneau de droite se met à jour à chaque frappe.\nCliquez « HTML » pour copier le code HTML correspondant.",
  'guide.markdown.details':
    "Rendu via marked (GitHub Flavored Markdown : tableaux, listes de tâches, blocs de code). Le HTML passe dans DOMPurify avant injection : balises script et gestionnaires d'événements retirés. Les images distantes s'affichent si leur URL est accessible. Le contenu est conservé d'une session à l'autre.",
  'guide.markdown.tip': '',

  // ─── JSON ↔ YAML ─────────────────────────────────────────────────
  'guide.json-yaml.role':
    "Convertit un document dans les deux sens entre JSON et YAML, en préservant les types scalaires (nombres, booléens, null).",
  'guide.json-yaml.need':
    "Passer d'un format de configuration à l'autre : Docker Compose, Kubernetes, GitHub Actions et pipelines CI utilisent YAML, beaucoup d'API et d'outils parlent JSON.",
  'guide.json-yaml.steps':
    "Choisissez le sens avec le bouton en haut à droite (JSON → YAML ou l'inverse).\nCollez la source dans le panneau de gauche.\nLe résultat s'affiche à droite ; le bouton de bascule réinjecte ce résultat comme nouvelle entrée.",
  'guide.json-yaml.details':
    "YAML géré par la bibliothèque yaml (ancres, blocs littéraux). Les commentaires YAML sont perdus lors de la conversion vers JSON. Conversion entièrement en mémoire.",
  'guide.json-yaml.tip': '',

  // ─── JSON to TypeScript ──────────────────────────────────────────
  'guide.json-to-ts.role':
    "Génère un jeu d'interfaces TypeScript à partir d'un objet JSON représentatif.",
  'guide.json-to-ts.need':
    "Typer rapidement une réponse d'API ou une fixture sans écrire les interfaces à la main.",
  'guide.json-to-ts.steps':
    "Collez un JSON représentatif dans le panneau de gauche.\nAjustez le nom de l'interface racine dans le champ en haut si besoin.\nCopiez les interfaces générées depuis le panneau de droite.",
  'guide.json-to-ts.details':
    "Les objets imbriqués deviennent des interfaces distinctes nommées d'après leur clé. Un tableau hétérogène produit une union (A | B)[]. Les valeurs null sont typées null, les tableaux vides unknown[]. Aucune inférence d'optionnalité : tous les champs sont marqués requis.",
  'guide.json-to-ts.tip':
    "Fournissez un exemple complet, tous les champs remplis, pour éviter les types null indésirables.",

  // ─── CSV ↔ JSON ─────────────────────────────────────────────────
  'guide.csv-json.role':
    "Convertit un CSV avec ligne d'en-tête en tableau d'objets JSON, et inversement.",
  'guide.csv-json.need':
    "Manipuler dans du code des données exportées d'un tableur, ou produire un CSV à partir d'une réponse d'API.",
  'guide.csv-json.steps':
    "Choisissez le délimiteur (virgule, point-virgule, tabulation, barre verticale).\nCollez les données dans le panneau de gauche.\nBasculez le sens de conversion avec le bouton en haut à droite si nécessaire.",
  'guide.csv-json.details':
    "La première ligne du CSV sert d'en-tête (les clés). Les guillemets doubles et les retours à la ligne échappés sont gérés. En CSV → JSON, les nombres et true/false sont typés, les cellules vides deviennent null. En sens inverse, un objet ou un tableau imbriqué est sérialisé en JSON dans la cellule.",
  'guide.csv-json.tip': '',

  // ─── .env ↔ JSON ────────────────────────────────────────────────
  'guide.dotenv-json.role':
    "Convertit un fichier .env en objet JSON et inversement.",
  'guide.dotenv-json.need':
    "Importer une configuration d'environnement dans un outil qui attend du JSON, ou générer un .env à partir d'un objet.",
  'guide.dotenv-json.steps':
    "Choisissez le sens (.env → JSON ou l'inverse).\nCollez le contenu dans le panneau de gauche.\nRécupérez le résultat à droite.",
  'guide.dotenv-json.details':
    "Les lignes de commentaire (#), les lignes vides et le préfixe export sont ignorés. Les guillemets simples ou doubles entourant une valeur sont retirés, les \\n littéraux deviennent des sauts de ligne. En sens inverse, une valeur contenant un espace ou un caractère spécial est mise entre guillemets automatiquement ; toutes les valeurs JSON sont converties en chaînes.",
  'guide.dotenv-json.tip':
    "Tout reste sur votre machine — mais par principe, ne manipulez de vrais secrets que dans des outils locaux.",

  // ─── Base64 ─────────────────────────────────────────────────────
  'guide.base64.role':
    "Encode du texte en Base64 ou décode une chaîne Base64 vers du texte lisible, en UTF-8.",
  'guide.base64.need':
    "Le Base64 transporte des données binaires ou non-ASCII dans un contexte texte : en-têtes HTTP, Data URI, champs JSON, en-tête Authorization: Basic.",
  'guide.base64.steps':
    "Collez le texte ou la chaîne Base64 dans le panneau « Entrée ».\nCliquez « Encoder » ou « Décoder ».\nCopiez le résultat.",
  'guide.base64.details':
    "Encodage UTF-8 correct : caractères accentués et emoji gérés. Base64 standard (caractères + et /), pas la variante « URL-safe ». Une chaîne mal formée renvoie une erreur explicite. Traitement local.",
  'guide.base64.tip':
    "Pour un JWT, préférez « JWT Decoder » qui sépare le header du payload.",

  // ─── JWT Decoder ────────────────────────────────────────────────
  'guide.jwt.role':
    "Décode un token JWT et affiche son header et son payload en JSON lisible, avec l'état d'expiration.",
  'guide.jwt.need':
    "Inspecter les claims d'un token (rôles, sub, exp) pendant un debug d'authentification, sans passer par un site tiers.",
  'guide.jwt.steps':
    "Collez le token complet (header.payload.signature) dans la zone de saisie.\nLe header et le payload s'affichent en JSON indenté.\nSi le claim exp est présent, un badge indique si le token est expiré.",
  'guide.jwt.details':
    "Décodage uniquement : la signature n'est pas vérifiée (aucune clé n'est demandée) et rien n'est envoyé. Un token à moins ou plus de 3 parties, ou dont le Base64URL est invalide, produit un message d'erreur.",
  'guide.jwt.tip':
    "exp et iat sont des timestamps Unix : collez-les dans « Timestamp Converter » pour une date lisible.",

  // ─── URL Encoder/Decoder ────────────────────────────────────────
  'guide.url.role':
    "Encode ou décode les caractères spéciaux d'une URL ou d'un paramètre (encodeURIComponent / decodeURIComponent).",
  'guide.url.need':
    "Construire une query string à la main, ou lire un paramètre redirect_uri encodé une ou plusieurs fois.",
  'guide.url.steps':
    "Collez le texte ou l'URL dans le panneau de gauche.\nCliquez « Encoder » ou « Décoder ».\nCopiez le résultat à droite.",
  'guide.url.details':
    "Opère sur la chaîne entière comme un composant d'URL, pas seulement la partie query. Une séquence % malformée au décodage renvoie une erreur. Traitement local.",
  'guide.url.tip':
    "Décodez plusieurs fois d'affilée pour repérer un double encodage.",

  // ─── String Escaper ────────────────────────────────────────────
  'guide.string-escape.role':
    "Échappe ou déséchappe une chaîne pour un contexte cible : JSON, entités HTML, URL, backslash, SQL, shell, expression régulière.",
  'guide.string-escape.need':
    "Insérer un texte dans un endroit qui a ses propres caractères réservés (un littéral de code, une requête SQL, une commande shell) sans casser la syntaxe.",
  'guide.string-escape.steps':
    "Choisissez la cible (JSON, HTML, URL…).\nCollez le texte dans « Entrée ».\nBasculez entre « Échapper » et « Déséchapper » avec le bouton d'en-tête.\nLe résultat se met à jour en direct.",
  'guide.string-escape.details':
    "JSON = contenu entre guillemets, sans les guillemets. HTML = & < > \" '. Shell = guillemets simples POSIX. SQL = quote simple doublée (échappement basique). Regex = métacaractères préfixés d'un backslash.",
  'guide.string-escape.tip':
    "Pour du SQL en production, utilisez toujours des requêtes paramétrées : cet outil sert au prototypage.",

  // ─── UUID Generator ─────────────────────────────────────────────
  'guide.uuid.role':
    "Génère des identifiants uniques universels version 4 (aléatoires).",
  'guide.uuid.need':
    "Créer une clé primaire, un identifiant de corrélation ou un nom de ressource sans dépendre d'un compteur central.",
  'guide.uuid.steps':
    "Réglez le nombre d'identifiants voulus (1 à 50).\nCliquez « Générer ».\nCopiez un identifiant, ou « Tout copier » pour la liste entière.",
  'guide.uuid.details':
    "Génération via crypto.randomUUID() du navigateur : aléatoire cryptographique, aucune requête réseau. Format v4 canonique en minuscules. Chaque clic régénère toute la liste.",
  'guide.uuid.tip': '',

  // ─── Hash Generator ────────────────────────────────────────────
  'guide.hash.role':
    "Calcule les empreintes SHA-1, SHA-256, SHA-384 et SHA-512 d'un texte, simultanément.",
  'guide.hash.need':
    "Vérifier l'intégrité d'une donnée, comparer un checksum, produire une clé de cache déterministe.",
  'guide.hash.steps':
    "Saisissez ou collez le texte dans « Texte source ».\nLes quatre empreintes se recalculent automatiquement à chaque frappe.\nCopiez celle qui vous intéresse.",
  'guide.hash.details':
    "Calcul via l'API Web Crypto native, en local. Entrée encodée en UTF-8. MD5 n'est pas proposé (obsolète). SHA-1 est fourni pour compatibilité mais déconseillé pour tout usage de sécurité.",
  'guide.hash.tip': '',

  // ─── Password Generator ────────────────────────────────────────
  'guide.password.role':
    "Génère des mots de passe aléatoires cryptographiquement sûrs, avec une estimation d'entropie.",
  'guide.password.need':
    "Créer un secret fort (compte de service, base de données, clé de chiffrement) sans passer par un générateur en ligne.",
  'guide.password.steps':
    "Réglez la longueur (6 à 64) avec le curseur.\nActivez les jeux de caractères voulus : minuscules, majuscules, chiffres, symboles.\nOption « exclure les caractères ambigus » (Il1O0o) pour une saisie manuelle.\nCliquez « Générer » pour un nouveau tirage, puis « Copier ».",
  'guide.password.details':
    "Tirage via crypto.getRandomValues avec rejet d'échantillonnage (pas de biais modulo). Entropie affichée = longueur × log2(taille du jeu). Repères : < 40 bits faible, 40–70 correct, 70–100 fort, > 100 très fort. Rien n'est stocké ni transmis.",
  'guide.password.tip':
    "20 caractères avec les quatre jeux ≈ 130 bits, largement suffisant.",

  // ─── Timestamp Converter ───────────────────────────────────────
  'guide.timestamp.role':
    "Convertit un timestamp Unix en date lisible (ISO, locale, UTC, relatif) et une date choisie en timestamp.",
  'guide.timestamp.need':
    "Les API et bases de données stockent des timestamps, les logs en contiennent partout, et ils sont illisibles à l'œil.",
  'guide.timestamp.steps':
    "Colonne de gauche : saisissez un timestamp (secondes ou millisecondes, détecté automatiquement) ou cliquez « Maintenant ».\nColonne de droite : choisissez une date et une heure pour obtenir le timestamp Unix correspondant.\nChaque valeur a son bouton de copie.",
  'guide.timestamp.details':
    "Un nombre de plus de 10 chiffres est interprété en millisecondes, sinon en secondes. Le format relatif (« il y a 3 heures ») suit la langue de l'interface. Le fuseau utilisé est l'heure locale de la machine.",
  'guide.timestamp.tip': '',

  // ─── Color Converter ───────────────────────────────────────────
  'guide.color.role':
    "Convertit une couleur entre HEX, RGB et HSL, avec un aperçu.",
  'guide.color.need':
    "Les maquettes, le CSS et les bibliothèques UI mélangent les formats ; il faut souvent passer de l'un à l'autre.",
  'guide.color.steps':
    "Saisissez un code HEX (#rrggbb) ou utilisez le sélecteur de couleur natif.\nLes valeurs RGB et HSL se calculent en direct.\nCopiez le format voulu (rgb(...), hsl(...)).",
  'guide.color.details':
    "Entrée : HEX à 6 chiffres uniquement (pas de raccourci à 3 chiffres ni de canal alpha). Les conversions sont arrondies à l'entier. L'aperçu est appliqué en fond de carte.",
  'guide.color.tip': '',

  // ─── Contrast Checker ──────────────────────────────────────────
  'guide.contrast.role':
    "Calcule le ratio de contraste entre deux couleurs et le confronte aux seuils WCAG 2.1.",
  'guide.contrast.need':
    "Vérifier qu'un texte reste lisible pour l'accessibilité, exigence de nombreux référentiels (RGAA, ADA, EN 301 549).",
  'guide.contrast.steps':
    "Choisissez la couleur du texte (premier plan) et celle du fond, au sélecteur ou en HEX.\nLe ratio et un aperçu de texte s'affichent.\nLe tableau indique la conformité AA / AAA pour texte normal, grand texte et éléments graphiques.",
  'guide.contrast.details':
    "Formule de luminance relative WCAG. Seuils : 4,5:1 (AA texte normal), 3:1 (AA grand texte et éléments), 7:1 (AAA texte normal), 4,5:1 (AAA grand texte). « Grand texte » = ≥ 18,66 px en gras ou ≥ 24 px. HEX à 6 chiffres.",
  'guide.contrast.tip':
    "Inversez texte et fond : le ratio est identique, mais l'aperçu aide à décider.",

  // ─── Number Base Converter ─────────────────────────────────────
  'guide.number-base.role':
    "Convertit un entier entre binaire, octal, décimal et hexadécimal, et affiche sa représentation en bits.",
  'guide.number-base.need':
    "Lire une valeur de registre, un masque de permissions Unix ou un flag bitwise exprimé dans une base et le vouloir dans une autre.",
  'guide.number-base.steps':
    "Saisissez un nombre : préfixes 0b, 0o, 0x reconnus, sinon décimal.\nLes quatre bases s'affichent avec un bouton de copie.\nRéglez la largeur (8 / 16 / 32 / 64) pour la grille de bits.",
  'guide.number-base.details':
    "Basé sur BigInt : aucune limite de taille, entiers négatifs gérés (préfixe -). Les _ et espaces dans l'entrée sont ignorés. La grille de bits n'est affichée que pour un entier positif.",
  'guide.number-base.tip': '',

  // ─── Cron Explainer ────────────────────────────────────────────
  'guide.cron.role':
    "Traduit une expression cron à 5 champs en phrase lisible et liste ses prochaines exécutions.",
  'guide.cron.need':
    "Vérifier qu'une planification fait bien ce qu'on croit avant de la déployer (sauvegarde, job périodique, relance).",
  'guide.cron.steps':
    "Saisissez les 5 champs (minute heure jour mois jour-semaine) ou cliquez un préréglage.\nLa signification en clair s'affiche.\nLa liste montre les 7 prochaines occurrences en heure locale.",
  'guide.cron.details':
    "Syntaxe standard : *, */n, a-b, a,b, a-b/n. Champ jour-semaine de 0 à 7 (0 et 7 = dimanche). Les extensions non standard (@daily, L, #, ?) ne sont pas gérées. La phrase suit la langue de l'interface.",
  'guide.cron.tip':
    "Si jour-du-mois et jour-de-semaine sont tous deux restreints, cron déclenche quand l'un OU l'autre correspond ; l'outil le reflète.",

  // ─── QR Code Generator ─────────────────────────────────────────
  'guide.qrcode.role':
    "Génère un QR code à partir d'une URL ou d'un texte, exportable en PNG.",
  'guide.qrcode.need':
    "Passer un lien du bureau au téléphone, afficher une URL sur un écran, partager une configuration.",
  'guide.qrcode.steps':
    "Saisissez le contenu à encoder.\nLe QR code se met à jour en direct.\nCliquez « Télécharger en PNG » pour l'enregistrer.",
  'guide.qrcode.details':
    "Génération locale via la bibliothèque qrcode, sans service externe. Correction d'erreur de niveau M, marge de 2 modules, 260 px. Un contenu trop long pour la capacité d'un QR renvoie une erreur.",
  'guide.qrcode.tip': '',

  // ─── API Client ────────────────────────────────────────────────
  'guide.api-tester.role':
    "Atelier d'API complet : requêtes nommées, collections et dossiers, environnements avec variables {{…}}, authentification, scripts pré-requête et tests, extraction automatique de variables, runner de collection, import cURL / OpenAPI, export cURL / fetch / axios / HTTPie.",
  'guide.api-tester.need':
    "Développer et tester un backend REST sans copier-coller les tokens entre les requêtes ni quitter DevDesk pour un autre client.",
  'guide.api-tester.steps':
    "Créez un environnement (bouton « Variables ») avec baseUrl et accessToken.\nDans une collection, cliquez « + fichier » pour créer une requête et nommez-la.\nRenseignez la méthode, l'URL ({{baseUrl}}/api/...), les en-têtes et le corps.\nOnglet « Extraction » : ajoutez une règle body → accessToken → accessToken sur la requête de login.\nOnglet « Auth » des requêtes suivantes : Bearer {{accessToken}}.\nCliquez « Envoyer » : réponse, tests et variables extraites s'affichent, l'historique se remplit.",
  'guide.api-tester.details':
    "Les requêtes partent du processus principal, donc pas de blocage CORS. Corps supportés : JSON, texte brut, x-www-form-urlencoded, GraphQL ; form-data retombe sur urlencoded (pas d'envoi de fichiers). Scripts via un contexte pm minimal (pm.test, pm.expect, pm.environment.set, pm.response.json()). Timeout de 30 s. Collections, historique (100 entrées) et environnements sont enregistrés dans un fichier local. Le runner rejoue une collection en propageant les variables extraites d'une requête à la suivante.",
  'guide.api-tester.tip':
    "L'extraction déclarative (onglet « Extraction ») remplace le copier-coller manuel du token : réglée une fois, {{accessToken}} est à jour après chaque login.",

  // ─── HTTP Status Codes ─────────────────────────────────────────
  'guide.http-status.role':
    "Référence recherchable des codes de statut HTTP courants, avec leur signification et leur usage côté API.",
  'guide.http-status.need':
    "Retrouver le sens d'un code croisé dans un log, ou choisir le bon code à renvoyer (201 vs 200, 401 vs 403, 422 vs 400).",
  'guide.http-status.steps':
    "Tapez un code, un nom ou un mot-clé dans le champ de recherche.\nLes résultats sont regroupés par classe (1xx à 5xx).",
  'guide.http-status.details':
    "Environ 30 codes parmi les plus utilisés, pas la liste exhaustive de l'IANA. Descriptions orientées pratique REST. Aucune requête réseau.",
  'guide.http-status.tip': '',

  // ─── Regex Tester ──────────────────────────────────────────────
  'guide.regex.role':
    "Teste une expression régulière contre un texte et surligne les correspondances en direct.",
  'guide.regex.need':
    "Mettre au point un pattern (validation, extraction, remplacement) sans allers-retours dans le code.",
  'guide.regex.steps':
    "Saisissez le pattern entre les deux barres obliques.\nRenseignez les flags (g, i, m, s, u…).\nCollez le texte à tester : les correspondances sont surlignées et comptées.",
  'guide.regex.details':
    "Moteur RegExp de JavaScript, mêmes règles que dans votre code JS/TS. Sans le flag g, seule la première correspondance est prise. Un pattern invalide affiche l'erreur du moteur. Groupes nommés et lookbehind supportés (Chromium récent).",
  'guide.regex.tip': '',

  // ─── Lorem Generator ───────────────────────────────────────────
  'guide.lorem.role':
    "Génère des paragraphes de faux texte latin (lorem ipsum).",
  'guide.lorem.need':
    "Remplir une maquette, un gabarit d'e-mail ou un composant avant d'avoir le contenu réel.",
  'guide.lorem.steps':
    "Réglez le nombre de paragraphes (1 à 20).\nCliquez « Générer ».\nCopiez le texte.",
  'guide.lorem.details':
    "Phrases de longueur variable à partir d'un vocabulaire latin classique. Génération locale, résultat aléatoire à chaque clic. Pas d'option HTML.",
  'guide.lorem.tip': '',

  // ─── Case Converter ────────────────────────────────────────────
  'guide.case.role':
    "Convertit un identifiant ou une phrase dans toutes les casses courantes : camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, Sentence case, minuscules, MAJUSCULES.",
  'guide.case.need':
    "Passer d'une convention de nommage à une autre (variable JS → constante d'environnement, titre → identifiant) sans renommer à la main.",
  'guide.case.steps':
    "Saisissez le texte source.\nChaque casse s'affiche dans sa propre carte avec un bouton de copie.",
  'guide.case.details':
    "Le découpage en mots reconnaît les espaces, tirets, underscores, points, ainsi que les limites camelCase / PascalCase et les suites de majuscules. Traitement local et instantané.",
  'guide.case.tip': '',

  // ─── Text Diff ─────────────────────────────────────────────────
  'guide.diff.role':
    "Compare deux textes ligne à ligne et surligne les ajouts et les suppressions.",
  'guide.diff.need':
    "Repérer ce qui a changé entre deux versions d'un contenu (configuration, réponse d'API, texte) sans ouvrir un outil de merge.",
  'guide.diff.steps':
    "Collez la version d'origine à gauche, la version modifiée à droite.\nLe résultat s'actualise en direct : lignes ajoutées en vert, supprimées en rouge, avec les numéros de ligne.\nLe compteur +/− résume l'ampleur du changement.",
  'guide.diff.details':
    "Algorithme de plus longue sous-séquence commune (diff ligne à ligne, pas intra-ligne). Comparaison exacte, espaces compris. Traitement local.",
  'guide.diff.tip':
    "Normalisez d'abord les deux textes (« Text & Line Utilities » → trim) pour éviter le bruit dû aux espaces.",

  // ─── Text & Line Utilities ─────────────────────────────────────
  'guide.text-utils.role':
    "Applique des opérations sur une liste de lignes : trier, dédupliquer, inverser, trim, retirer les vides, changer la casse, mélanger.",
  'guide.text-utils.need':
    "Nettoyer une liste collée depuis un fichier, un tableur ou un export avant de la réutiliser.",
  'guide.text-utils.steps':
    "Collez une valeur par ligne.\nCliquez une opération : elle s'applique en place, sur le contenu courant.\nEnchaînez les opérations, puis copiez le résultat.\nLe pied affiche lignes, mots, caractères et octets.",
  'guide.text-utils.details':
    "Le tri suit l'ordre local (localeCompare). La déduplication est sensible à la casse et aux espaces. « Mélanger » utilise Fisher-Yates. Traitement local.",
  'guide.text-utils.tip': '',

  // ─── Slug Generator ────────────────────────────────────────────
  'guide.slug.role':
    "Transforme un ou plusieurs textes en slugs d'URL : accents retirés, séparateur au choix, longueur maximale.",
  'guide.slug.need':
    "Générer des permaliens propres et stables pour des articles, des pages ou des identifiants lisibles.",
  'guide.slug.steps':
    "Collez une ou plusieurs lignes (un slug par ligne).\nRéglez le séparateur (-, _, .), le mode minuscules, le mode strict et la longueur maximale.\nCopiez un slug, ou « Tout copier ».",
  'guide.slug.details':
    "Normalisation Unicode (NFKD) pour retirer les diacritiques. Le mode strict ne garde que a-z 0-9 et le séparateur. La troncature à la longueur maximale coupe sur un séparateur pour ne pas laisser un mot à moitié. Traitement local.",
  'guide.slug.tip': '',
};
