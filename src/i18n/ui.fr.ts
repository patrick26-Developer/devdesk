// Chaînes d'interface des outils (corps des composants), français (source).
export const uiFr: Record<string, string> = {
  // json-formatter
  'ui.json.needInput': 'Veuillez saisir un JSON à traiter.',
  'ui.json.sourceJson': 'JSON source',
  'ui.json.transformed': 'JSON transformé',
  'ui.json.hintInput': 'Collez ou saisissez votre JSON',
  'ui.json.placeholder': '{\n  "exemple": "collez votre JSON ici"\n}',

  // base64
  'ui.base64.invalid': 'Chaîne Base64 invalide',
  'ui.base64.inputSub': 'Texte ou chaîne Base64',
  'ui.base64.resultSub': "Résultat de l'opération",
  'ui.base64.placeholder': 'Saisissez votre texte ou votre chaîne Base64…',
  'ui.base64.hint': 'Choisissez une opération pour transformer votre contenu.',

  // uuid
  'ui.uuid.count': 'identifiant(s)',
  'ui.uuid.note': 'Les identifiants sont générés localement à partir de crypto.randomUUID() sans requête réseau.',

  // jwt
  'ui.jwt.badFormat': 'Format invalide : un JWT doit contenir 3 parties séparées par des points',
  'ui.jwt.badDecode': 'Impossible de décoder ce token (Base64 ou JSON invalide)',
  'ui.jwt.localOnly': "Décodage uniquement en local — aucune vérification de signature et aucune donnée envoyée à un serveur.",
  'ui.jwt.label': 'Token JWT',
  'ui.jwt.invalid': 'Token invalide',
  'ui.jwt.headerSub': 'Métadonnées du token',
  'ui.jwt.payloadSub': 'Claims et données',
  'ui.jwt.expired': 'Token expiré',
  'ui.jwt.notExpired': 'Token non expiré',
  'ui.jwt.emptyTitle': 'Aucun token à analyser',
  'ui.jwt.emptyDesc': 'Collez un token JWT dans la zone ci-dessus pour afficher automatiquement son header et son payload.',

  // hash
  'ui.hash.note': "Les empreintes sont calculées localement avec l'API Web Crypto native. Aucune donnée n'est envoyée vers un serveur.",
  'ui.hash.sourceTitle': 'Texte source',
  'ui.hash.sourceSub': 'Le hash est recalculé automatiquement à chaque modification.',
  'ui.hash.placeholder': 'Saisissez le texte à hasher…',
  'ui.hash.auto': 'Analyse automatique',
  'ui.hash.waitingSource': 'En attente du texte source',
  'ui.hash.sha1note': 'SHA-1 est conservé pour compatibilité. Pour les nouveaux usages de sécurité, privilégiez SHA-256 ou supérieur.',

  // url
  'ui.url.invalid': 'Chaîne encodée invalide (séquence % malformée)',
  'ui.url.inputSub': 'Texte ou URL',
  'ui.url.resultSub': 'Valeur transformée',
  'ui.url.placeholder': 'https://exemple.com?q=café & croissant',

  // timestamp
  'ui.ts.toDate': 'Timestamp → Date',
  'ui.ts.toDateSub': 'Secondes ou millisecondes',
  'ui.ts.now': 'Maintenant',
  'ui.ts.local': 'Local',
  'ui.ts.relative': 'Relatif',
  'ui.ts.toTs': 'Date → Timestamp',
  'ui.ts.toTsSub': 'Date et heure locales',
  'ui.ts.dateTimeLabel': 'Date et heure',
  'ui.ts.unix': 'Timestamp Unix',

  // regex
  'ui.regex.pattern': 'Expression régulière',
  'ui.regex.patternPlaceholder': 'votre pattern regex',
  'ui.regex.flagsLabel': "Flags de l'expression régulière",
  'ui.regex.testText': 'Texte à tester',
  'ui.regex.testPlaceholder': 'Colle ton texte à tester ici…',
  'ui.regex.matches': 'Correspondances',
  'ui.regex.resultCount': '{n} résultat',
  'ui.regex.resultCountPlural': '{n} résultats',

  // color
  'ui.color.previewSub': 'Couleur sélectionnée',
  'ui.color.invalidHex': 'HEX invalide',
  'ui.color.pick': 'Sélectionner une couleur',
  'ui.color.pickSub': 'Utilisez le sélecteur natif ou saisissez directement une valeur HEX.',
  'ui.color.pickerLabel': 'Sélecteur de couleur',
  'ui.color.hexLabel': 'Valeur hexadécimale',
  'ui.color.badFormat': 'Format invalide. Utilisez le format #rrggbb.',

  // markdown
  'ui.md.default': '# Titre\n\nTape du **Markdown** ici.',
  'ui.md.sanitized': 'Aperçu nettoyé avec DOMPurify avant injection HTML.',
  'ui.md.editor': 'Éditeur',
  'ui.md.placeholder': '# Votre titre…',
  'ui.md.previewSub': 'Rendu en temps réel',
};
