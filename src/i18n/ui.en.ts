// Tool UI strings (component bodies), English overrides.
export const uiEn: Record<string, string> = {
  // json-formatter
  'ui.json.needInput': 'Please enter some JSON to process.',
  'ui.json.sourceJson': 'Source JSON',
  'ui.json.transformed': 'Transformed JSON',
  'ui.json.hintInput': 'Paste or type your JSON',
  'ui.json.placeholder': '{\n  "example": "paste your JSON here"\n}',

  // base64
  'ui.base64.invalid': 'Invalid Base64 string',
  'ui.base64.inputSub': 'Text or Base64 string',
  'ui.base64.resultSub': 'Operation result',
  'ui.base64.placeholder': 'Enter your text or Base64 string…',
  'ui.base64.hint': 'Pick an operation to transform your content.',

  // uuid
  'ui.uuid.count': 'identifier(s)',
  'ui.uuid.note': 'Identifiers are generated locally with crypto.randomUUID(), no network request.',

  // jwt
  'ui.jwt.badFormat': 'Invalid format: a JWT must have 3 parts separated by dots',
  'ui.jwt.badDecode': 'Cannot decode this token (invalid Base64 or JSON)',
  'ui.jwt.localOnly': 'Decoding is local only — no signature verification and no data sent to a server.',
  'ui.jwt.label': 'JWT token',
  'ui.jwt.invalid': 'Invalid token',
  'ui.jwt.headerSub': 'Token metadata',
  'ui.jwt.payloadSub': 'Claims and data',
  'ui.jwt.expired': 'Token expired',
  'ui.jwt.notExpired': 'Token not expired',
  'ui.jwt.emptyTitle': 'No token to inspect',
  'ui.jwt.emptyDesc': 'Paste a JWT token in the area above to automatically show its header and payload.',

  // hash
  'ui.hash.note': 'Hashes are computed locally with the native Web Crypto API. No data is sent to a server.',
  'ui.hash.sourceTitle': 'Source text',
  'ui.hash.sourceSub': 'The hash is recomputed automatically on every change.',
  'ui.hash.placeholder': 'Enter the text to hash…',
  'ui.hash.auto': 'Automatic analysis',
  'ui.hash.waitingSource': 'Waiting for source text',
  'ui.hash.sha1note': 'SHA-1 is kept for compatibility. For new security use cases, prefer SHA-256 or above.',

  // url
  'ui.url.invalid': 'Invalid encoded string (malformed % sequence)',
  'ui.url.inputSub': 'Text or URL',
  'ui.url.resultSub': 'Transformed value',
  'ui.url.placeholder': 'https://example.com?q=café & croissant',

  // timestamp
  'ui.ts.toDate': 'Timestamp → Date',
  'ui.ts.toDateSub': 'Seconds or milliseconds',
  'ui.ts.now': 'Now',
  'ui.ts.local': 'Local',
  'ui.ts.relative': 'Relative',
  'ui.ts.toTs': 'Date → Timestamp',
  'ui.ts.toTsSub': 'Local date and time',
  'ui.ts.dateTimeLabel': 'Date and time',
  'ui.ts.unix': 'Unix timestamp',

  // regex
  'ui.regex.pattern': 'Regular expression',
  'ui.regex.patternPlaceholder': 'your regex pattern',
  'ui.regex.flagsLabel': 'Regular expression flags',
  'ui.regex.testText': 'Text to test',
  'ui.regex.testPlaceholder': 'Paste your test text here…',
  'ui.regex.matches': 'Matches',
  'ui.regex.resultCount': '{n} match',
  'ui.regex.resultCountPlural': '{n} matches',

  // color
  'ui.color.previewSub': 'Selected color',
  'ui.color.invalidHex': 'Invalid HEX',
  'ui.color.pick': 'Pick a color',
  'ui.color.pickSub': 'Use the native picker or type a HEX value directly.',
  'ui.color.pickerLabel': 'Color picker',
  'ui.color.hexLabel': 'Hexadecimal value',
  'ui.color.badFormat': 'Invalid format. Use the #rrggbb format.',

  // markdown
  'ui.md.default': '# Title\n\nType some **Markdown** here.',
  'ui.md.sanitized': 'Preview sanitized with DOMPurify before HTML injection.',
  'ui.md.editor': 'Editor',
  'ui.md.placeholder': '# Your title…',
  'ui.md.previewSub': 'Real-time render',
};
