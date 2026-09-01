// Tool descriptions + guide content, English overrides.
// Guide uses 5 fields per tool: role, need, steps (\n-separated), details, tip ('' when none).
export const toolsEn: Record<string, string> = {
  'tool.json-formatter.desc': 'Format, minify and validate your JSON in seconds.',
  'tool.base64.desc': 'Encode or decode a Base64 string in seconds.',
  'tool.uuid.desc': 'Generates unique, random UUID v4 identifiers.',
  'tool.regex.desc': 'Test and visualize your regular expressions in real time.',
  'tool.timestamp.desc': 'Convert Unix timestamps to readable dates and back.',
  'tool.color.desc': 'Convert a color between HEX, RGB and HSL.',
  'tool.jwt.desc': 'Inspect the header and payload of a JWT token locally.',
  'tool.hash.desc': 'Generate several cryptographic hashes from a text.',
  'tool.url.desc': 'Encode or decode URLs and parameters in seconds.',
  'tool.markdown.desc': 'Write Markdown and see its rendering instantly.',
  'tool.lorem.desc': 'Generate placeholder text for your mockups and prototypes.',
  'tool.qrcode.desc': 'Turn a URL or text into an exportable QR code.',
  'tool.api-tester.desc': 'API workbench: environments, collections, variables, tests, runner.',
  'tool.case.desc': 'Convert text between camelCase, snake_case, kebab-case…',
  'tool.password.desc': 'Generate strong random passwords, locally.',
  'tool.contrast.desc': 'Check the contrast of two colors against WCAG criteria.',
  'tool.diff.desc': 'Compare two texts line by line and highlight the differences.',
  'tool.number-base.desc': 'Convert an integer between binary, octal, decimal and hexadecimal.',
  'tool.text-utils.desc': 'Sort, deduplicate, clean and count lines of text.',
  'tool.json-yaml.desc': 'Convert both ways between JSON and YAML.',
  'tool.cron.desc': 'Explain a cron expression and list its next runs.',
  'tool.json-to-ts.desc': 'Generate TypeScript interfaces from a JSON object.',
  'tool.csv-json.desc': 'Convert a CSV into a JSON array and back.',
  'tool.string-escape.desc': 'Escape / unescape for JSON, HTML, URL, SQL, shell, regex.',
  'tool.dotenv-json.desc': 'Convert a .env file to JSON and back.',
  'tool.http-status.desc': 'Searchable reference of HTTP status codes and their usage.',
  'tool.slug.desc': 'Turn text into a URL slug (accents, separator, length).',

  // ─── JSON Formatter ──────────────────────────────────────────────
  'guide.json-formatter.role':
    'Parses a JSON document, formats it with 2-space indentation or compacts it onto a single line, and pinpoints the first syntax error.',
  'guide.json-formatter.need':
    'JSON returned by an API or copied from a log often comes on a single line, unreadable for a manual check. Conversely, before pasting it into a config file you sometimes want it compact.',
  'guide.json-formatter.steps':
    'Paste or type the JSON in the "Input" panel (Paste button to grab the clipboard).\nClick "Format" to indent it, or "Minify" to shrink it to one line.\nThe "Result" panel shows the output; the copy icon puts it on the clipboard.\nOn error, the exact message (position included) appears below the panels.',
  'guide.json-formatter.details':
    'The parser is the native JSON.parse: comments, trailing commas and unquoted keys are rejected. Key order, numbers and Unicode encoding are preserved. Everything is processed in memory, nothing is sent.',
  'guide.json-formatter.tip':
    'On Home, "Analyze the clipboard" detects JSON and opens this tool pre-filled.',

  // ─── Markdown Preview ────────────────────────────────────────────
  'guide.markdown.role':
    'A Markdown editor with a live HTML preview, sanitized before display. The "HTML" button copies the generated code.',
  'guide.markdown.need':
    'Check the rendering of a README, a ticket description or a long comment before publishing it.',
  'guide.markdown.steps':
    'Write Markdown in the left editor.\nThe right panel updates on every keystroke.\nClick "HTML" to copy the corresponding HTML code.',
  'guide.markdown.details':
    'Rendered with marked (GitHub Flavored Markdown: tables, task lists, code blocks). The HTML runs through DOMPurify before injection: script tags and event handlers are removed. Remote images display if their URL is reachable. Content is kept between sessions.',
  'guide.markdown.tip': '',

  // ─── JSON ↔ YAML ────────────────────────────────────────────────
  'guide.json-yaml.role':
    'Converts a document both ways between JSON and YAML, preserving scalar types (numbers, booleans, null).',
  'guide.json-yaml.need':
    'Move between config formats: Docker Compose, Kubernetes, GitHub Actions and CI pipelines use YAML, while many APIs and tools speak JSON.',
  'guide.json-yaml.steps':
    'Pick the direction with the top-right button (JSON → YAML or the reverse).\nPaste the source in the left panel.\nThe result shows on the right; the toggle button feeds that result back as new input.',
  'guide.json-yaml.details':
    'YAML is handled by the yaml library (anchors, literal blocks). YAML comments are lost when converting to JSON. Conversion happens entirely in memory.',
  'guide.json-yaml.tip': '',

  // ─── JSON to TypeScript ─────────────────────────────────────────
  'guide.json-to-ts.role':
    'Generates a set of TypeScript interfaces from a representative JSON object.',
  'guide.json-to-ts.need':
    'Quickly type an API response or a fixture without writing the interfaces by hand.',
  'guide.json-to-ts.steps':
    'Paste a representative JSON in the left panel.\nAdjust the root interface name in the top field if needed.\nCopy the generated interfaces from the right panel.',
  'guide.json-to-ts.details':
    'Nested objects become separate interfaces named after their key. A heterogeneous array produces a (A | B)[] union. null values are typed null, empty arrays unknown[]. No optionality inference: every field is marked required.',
  'guide.json-to-ts.tip':
    'Provide a complete example, every field filled, to avoid unwanted null types.',

  // ─── CSV ↔ JSON ────────────────────────────────────────────────
  'guide.csv-json.role':
    'Converts a CSV with a header row into an array of JSON objects, and back.',
  'guide.csv-json.need':
    'Work with spreadsheet-exported data in code, or produce a CSV from an API response.',
  'guide.csv-json.steps':
    'Choose the delimiter (comma, semicolon, tab, pipe).\nPaste the data in the left panel.\nToggle the conversion direction with the top-right button if needed.',
  'guide.csv-json.details':
    'The first CSV row is the header (the keys). Double quotes and escaped newlines are handled. In CSV → JSON, numbers and true/false are typed, empty cells become null. The other way, a nested object or array is serialized as JSON inside the cell.',
  'guide.csv-json.tip': '',

  // ─── .env ↔ JSON ───────────────────────────────────────────────
  'guide.dotenv-json.role': 'Converts a .env file into a JSON object and back.',
  'guide.dotenv-json.need':
    'Import an environment config into a tool that expects JSON, or generate a .env from an object.',
  'guide.dotenv-json.steps':
    'Choose the direction (.env → JSON or the reverse).\nPaste the content in the left panel.\nGrab the result on the right.',
  'guide.dotenv-json.details':
    'Comment lines (#), blank lines and the export prefix are ignored. Single or double quotes around a value are stripped, literal \\n become line breaks. The other way, a value with a space or special character is quoted automatically; all JSON values are converted to strings.',
  'guide.dotenv-json.tip':
    'Everything stays on your machine — but as a rule, only handle real secrets in local tools.',

  // ─── Base64 ────────────────────────────────────────────────────
  'guide.base64.role':
    'Encodes text to Base64 or decodes a Base64 string back to readable UTF-8 text.',
  'guide.base64.need':
    'Base64 carries binary or non-ASCII data in a text context: HTTP headers, Data URIs, JSON fields, the Authorization: Basic header.',
  'guide.base64.steps':
    'Paste the text or Base64 string in the "Input" panel.\nClick "Encode" or "Decode".\nCopy the result.',
  'guide.base64.details':
    'Correct UTF-8 encoding: accented characters and emoji are handled. Standard Base64 (+ and / characters), not the URL-safe variant. A malformed string returns an explicit error. Local processing.',
  'guide.base64.tip':
    'For a JWT, prefer "JWT Decoder", which separates header from payload.',

  // ─── JWT Decoder ───────────────────────────────────────────────
  'guide.jwt.role':
    'Decodes a JWT token and shows its header and payload as readable JSON, with expiry state.',
  'guide.jwt.need':
    'Inspect a token\'s claims (roles, sub, exp) during an auth debug, without a third-party site.',
  'guide.jwt.steps':
    'Paste the full token (header.payload.signature) into the input area.\nThe header and payload display as indented JSON.\nIf the exp claim is present, a badge shows whether the token is expired.',
  'guide.jwt.details':
    'Decoding only: the signature is not verified (no key is asked for) and nothing is sent. A token with fewer or more than 3 parts, or with invalid Base64URL, returns an error message.',
  'guide.jwt.tip':
    'exp and iat are Unix timestamps: paste them into "Timestamp Converter" for a readable date.',

  // ─── URL Encoder/Decoder ───────────────────────────────────────
  'guide.url.role':
    'Encodes or decodes the special characters of a URL or a parameter (encodeURIComponent / decodeURIComponent).',
  'guide.url.need':
    'Build a query string by hand, or read a redirect_uri parameter encoded one or more times.',
  'guide.url.steps':
    'Paste the text or URL in the left panel.\nClick "Encode" or "Decode".\nCopy the result on the right.',
  'guide.url.details':
    'Operates on the whole string as a URL component, not just the query part. A malformed % sequence on decode returns an error. Local processing.',
  'guide.url.tip': 'Decode several times in a row to spot double encoding.',

  // ─── String Escaper ───────────────────────────────────────────
  'guide.string-escape.role':
    'Escapes or unescapes a string for a target context: JSON, HTML entities, URL, backslash, SQL, shell, regular expression.',
  'guide.string-escape.need':
    'Insert a text into a place that has its own reserved characters (a code literal, a SQL query, a shell command) without breaking the syntax.',
  'guide.string-escape.steps':
    'Choose the target (JSON, HTML, URL…).\nPaste the text in "Input".\nToggle between "Escape" and "Unescape" with the header button.\nThe result updates live.',
  'guide.string-escape.details':
    'JSON = quoted content, without the quotes. HTML = & < > " \'. Shell = POSIX single quotes. SQL = doubled single quote (basic escaping). Regex = metacharacters prefixed with a backslash.',
  'guide.string-escape.tip':
    'For production SQL, always use parameterized queries: this tool is for prototyping.',

  // ─── UUID Generator ───────────────────────────────────────────
  'guide.uuid.role': 'Generates universally unique identifiers, version 4 (random).',
  'guide.uuid.need':
    'Create a primary key, a correlation id or a resource name without relying on a central counter.',
  'guide.uuid.steps':
    'Set the number of identifiers you want (1 to 50).\nClick "Generate".\nCopy one identifier, or "Copy all" for the whole list.',
  'guide.uuid.details':
    'Generated with the browser\'s crypto.randomUUID(): cryptographic randomness, no network request. Canonical lowercase v4 format. Each click regenerates the whole list.',
  'guide.uuid.tip': '',

  // ─── Hash Generator ──────────────────────────────────────────
  'guide.hash.role':
    'Computes the SHA-1, SHA-256, SHA-384 and SHA-512 hashes of a text, all at once.',
  'guide.hash.need':
    'Verify a piece of data\'s integrity, compare a checksum, produce a deterministic cache key.',
  'guide.hash.steps':
    'Type or paste the text in "Source text".\nThe four hashes recompute automatically on every keystroke.\nCopy the one you need.',
  'guide.hash.details':
    'Computed with the native Web Crypto API, locally. Input encoded as UTF-8. MD5 is not offered (obsolete). SHA-1 is provided for compatibility but discouraged for any security use.',
  'guide.hash.tip': '',

  // ─── Password Generator ──────────────────────────────────────
  'guide.password.role':
    'Generates cryptographically secure random passwords, with an entropy estimate.',
  'guide.password.need':
    'Create a strong secret (service account, database, encryption key) without going through an online generator.',
  'guide.password.steps':
    'Set the length (6 to 64) with the slider.\nEnable the character sets you want: lowercase, uppercase, digits, symbols.\n"Exclude ambiguous characters" (Il1O0o) option for manual entry.\nClick "Generate" for a new draw, then "Copy".',
  'guide.password.details':
    'Drawn with crypto.getRandomValues using rejection sampling (no modulo bias). Displayed entropy = length × log2(set size). Guide: < 40 bits weak, 40–70 fair, 70–100 strong, > 100 very strong. Nothing is stored or sent.',
  'guide.password.tip': '20 characters with all four sets ≈ 130 bits, more than enough.',

  // ─── Timestamp Converter ─────────────────────────────────────
  'guide.timestamp.role':
    'Converts a Unix timestamp into a readable date (ISO, local, UTC, relative) and a chosen date into a timestamp.',
  'guide.timestamp.need':
    'APIs and databases store timestamps, logs are full of them, and they are unreadable at a glance.',
  'guide.timestamp.steps':
    'Left column: type a timestamp (seconds or milliseconds, auto-detected) or click "Now".\nRight column: pick a date and time to get the matching Unix timestamp.\nEvery value has its own copy button.',
  'guide.timestamp.details':
    'A number with more than 10 digits is read as milliseconds, otherwise as seconds. The relative format ("3 hours ago") follows the interface language. The time zone used is the machine\'s local time.',
  'guide.timestamp.tip': '',

  // ─── Color Converter ────────────────────────────────────────
  'guide.color.role': 'Converts a color between HEX, RGB and HSL, with a preview.',
  'guide.color.need':
    'Mockups, CSS and UI libraries mix formats; you often need to move from one to another.',
  'guide.color.steps':
    'Type a HEX code (#rrggbb) or use the native color picker.\nThe RGB and HSL values compute live.\nCopy the format you want (rgb(...), hsl(...)).',
  'guide.color.details':
    'Input: 6-digit HEX only (no 3-digit shorthand, no alpha channel). Conversions are rounded to integers. The preview is applied as the card background.',
  'guide.color.tip': '',

  // ─── Contrast Checker ───────────────────────────────────────
  'guide.contrast.role':
    'Computes the contrast ratio between two colors and checks it against the WCAG 2.1 thresholds.',
  'guide.contrast.need':
    'Verify that text stays readable for accessibility, a requirement of many standards (WCAG, ADA, EN 301 549).',
  'guide.contrast.steps':
    'Choose the text (foreground) color and the background color, with the picker or in HEX.\nThe ratio and a text preview display.\nThe table shows AA / AAA compliance for normal text, large text and graphic elements.',
  'guide.contrast.details':
    'WCAG relative luminance formula. Thresholds: 4.5:1 (AA normal text), 3:1 (AA large text and elements), 7:1 (AAA normal text), 4.5:1 (AAA large text). "Large text" = ≥ 18.66 px bold or ≥ 24 px. 6-digit HEX.',
  'guide.contrast.tip':
    'Swap text and background: the ratio is the same, but the preview helps you decide.',

  // ─── Number Base Converter ──────────────────────────────────
  'guide.number-base.role':
    'Converts an integer between binary, octal, decimal and hexadecimal, and shows its bit representation.',
  'guide.number-base.need':
    'Read a register value, a Unix permission mask or a bitwise flag expressed in one base and want it in another.',
  'guide.number-base.steps':
    'Type a number: 0b, 0o, 0x prefixes recognized, otherwise decimal.\nThe four bases display with a copy button.\nSet the width (8 / 16 / 32 / 64) for the bit grid.',
  'guide.number-base.details':
    'BigInt-based: no size limit, negative integers handled (- prefix). _ and spaces in the input are ignored. The bit grid is only shown for a positive integer.',
  'guide.number-base.tip': '',

  // ─── Cron Explainer ─────────────────────────────────────────
  'guide.cron.role':
    'Translates a 5-field cron expression into a readable sentence and lists its next runs.',
  'guide.cron.need':
    'Check that a schedule does what you think before deploying it (backup, periodic job, retry).',
  'guide.cron.steps':
    'Type the 5 fields (minute hour day month day-of-week) or click a preset.\nThe plain-language meaning displays.\nThe list shows the next 7 occurrences in local time.',
  'guide.cron.details':
    'Standard syntax: *, */n, a-b, a,b, a-b/n. Day-of-week field 0 to 7 (0 and 7 = Sunday). Non-standard extensions (@daily, L, #, ?) are not handled. The sentence follows the interface language.',
  'guide.cron.tip':
    'When day-of-month and day-of-week are both restricted, cron fires when either one matches; the tool reflects that.',

  // ─── QR Code Generator ──────────────────────────────────────
  'guide.qrcode.role':
    'Generates a QR code from a URL or text, exportable as PNG.',
  'guide.qrcode.need':
    'Move a link from desktop to phone, show a URL on a screen, share a configuration.',
  'guide.qrcode.steps':
    'Type the content to encode.\nThe QR code updates live.\nClick "Download as PNG" to save it.',
  'guide.qrcode.details':
    'Generated locally with the qrcode library, no external service. Error correction level M, 2-module margin, 260 px. Content too long for a QR code\'s capacity returns an error.',
  'guide.qrcode.tip': '',

  // ─── API Client ─────────────────────────────────────────────
  'guide.api-tester.role':
    'A full API workbench: named requests, collections and folders, environments with {{…}} variables, authentication, pre-request and test scripts, automatic variable extraction, a collection runner, cURL / OpenAPI import, cURL / fetch / axios / HTTPie export.',
  'guide.api-tester.need':
    'Develop and test a REST backend without copy-pasting tokens between requests or leaving DevDesk for another client.',
  'guide.api-tester.steps':
    'Create an environment ("Variables" button) with baseUrl and accessToken.\nIn a collection, click "+ file" to create a request and name it.\nFill in the method, URL ({{baseUrl}}/api/...), headers and body.\n"Extract" tab: add a body → accessToken → accessToken rule on the login request.\n"Auth" tab of the following requests: Bearer {{accessToken}}.\nClick "Send": response, tests and extracted variables display, history fills up.',
  'guide.api-tester.details':
    'Requests go out from the main process, so no CORS blocking. Supported bodies: JSON, raw text, x-www-form-urlencoded, GraphQL; form-data falls back to urlencoded (no file upload). Scripts run in a minimal pm context (pm.test, pm.expect, pm.environment.set, pm.response.json()). 30 s timeout. Collections, history (100 entries) and environments are saved to a local file. The runner replays a collection, propagating extracted variables from one request to the next.',
  'guide.api-tester.tip':
    'Declarative extraction (the "Extract" tab) replaces manual token copy-paste: set once, {{accessToken}} is up to date after every login.',

  // ─── HTTP Status Codes ──────────────────────────────────────
  'guide.http-status.role':
    'A searchable reference of common HTTP status codes, with their meaning and their API-side usage.',
  'guide.http-status.need':
    'Look up the meaning of a code seen in a log, or choose the right code to return (201 vs 200, 401 vs 403, 422 vs 400).',
  'guide.http-status.steps':
    'Type a code, a name or a keyword in the search field.\nResults are grouped by class (1xx to 5xx).',
  'guide.http-status.details':
    'About 30 of the most used codes, not the exhaustive IANA list. Descriptions are REST-practice oriented. No network request.',
  'guide.http-status.tip': '',

  // ─── Regex Tester ───────────────────────────────────────────
  'guide.regex.role':
    'Tests a regular expression against a text and highlights the matches live.',
  'guide.regex.need':
    'Work out a pattern (validation, extraction, replacement) without round trips into the code.',
  'guide.regex.steps':
    'Type the pattern between the two slashes.\nEnter the flags (g, i, m, s, u…).\nPaste the text to test: matches are highlighted and counted.',
  'guide.regex.details':
    'JavaScript RegExp engine, same rules as in your JS/TS code. Without the g flag, only the first match is taken. An invalid pattern shows the engine error. Named groups and lookbehind supported (recent Chromium).',
  'guide.regex.tip': '',

  // ─── Lorem Generator ────────────────────────────────────────
  'guide.lorem.role': 'Generates paragraphs of fake Latin text (lorem ipsum).',
  'guide.lorem.need':
    'Fill a mockup, an email template or a component before you have the real content.',
  'guide.lorem.steps':
    'Set the number of paragraphs (1 to 20).\nClick "Generate".\nCopy the text.',
  'guide.lorem.details':
    'Variable-length sentences from a classic Latin vocabulary. Local generation, random result on each click. No HTML option.',
  'guide.lorem.tip': '',

  // ─── Case Converter ─────────────────────────────────────────
  'guide.case.role':
    'Converts an identifier or a phrase into every common case: camelCase, PascalCase, snake_case, kebab-case, CONSTANT_CASE, Title Case, Sentence case, lowercase, UPPERCASE.',
  'guide.case.need':
    'Move from one naming convention to another (JS variable → environment constant, title → identifier) without renaming by hand.',
  'guide.case.steps':
    'Type the source text.\nEach case displays in its own card with a copy button.',
  'guide.case.details':
    'Word splitting recognizes spaces, hyphens, underscores, dots, as well as camelCase / PascalCase boundaries and runs of uppercase. Local and instant.',
  'guide.case.tip': '',

  // ─── Text Diff ──────────────────────────────────────────────
  'guide.diff.role':
    'Compares two texts line by line and highlights additions and deletions.',
  'guide.diff.need':
    'Spot what changed between two versions of a piece of content (config, API response, text) without opening a merge tool.',
  'guide.diff.steps':
    'Paste the original version on the left, the modified version on the right.\nThe result updates live: added lines in green, removed in red, with line numbers.\nThe +/− counter sums up the size of the change.',
  'guide.diff.details':
    'Longest common subsequence algorithm (line-by-line diff, not intra-line). Exact comparison, whitespace included. Local processing.',
  'guide.diff.tip':
    'Normalize both texts first ("Text & Line Utilities" → trim) to avoid noise from whitespace.',

  // ─── Text & Line Utilities ──────────────────────────────────
  'guide.text-utils.role':
    'Applies operations to a list of lines: sort, deduplicate, reverse, trim, remove empties, change case, shuffle.',
  'guide.text-utils.need':
    'Clean a list pasted from a file, a spreadsheet or an export before reusing it.',
  'guide.text-utils.steps':
    'Paste one value per line.\nClick an operation: it applies in place, on the current content.\nChain operations, then copy the result.\nThe footer shows lines, words, characters and bytes.',
  'guide.text-utils.details':
    'Sorting uses locale order (localeCompare). Deduplication is case- and whitespace-sensitive. "Shuffle" uses Fisher-Yates. Local processing.',
  'guide.text-utils.tip': '',

  // ─── Slug Generator ─────────────────────────────────────────
  'guide.slug.role':
    'Turns one or more texts into URL slugs: accents removed, separator of your choice, maximum length.',
  'guide.slug.need':
    'Generate clean, stable permalinks for articles, pages or readable identifiers.',
  'guide.slug.steps':
    'Paste one or more lines (one slug per line).\nSet the separator (-, _, .), lowercase mode, strict mode and maximum length.\nCopy a slug, or "Copy all".',
  'guide.slug.details':
    'Unicode normalization (NFKD) to strip diacritics. Strict mode keeps only a-z 0-9 and the separator. Truncation to the maximum length cuts on a separator so a word is never left half-way. Local processing.',
  'guide.slug.tip': '',
};
