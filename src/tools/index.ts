// Import des icônes lucide-react pour chaque outil de la sidebar
// Chaque icône est un composant React qui accepte une prop className optionnelle
import {
  Code2,          // JSON Formatter - accolades de code
  Binary,         // Base64 - symboles binaires
  Fingerprint,    // UUID - empreinte digitale (unicité)
  Regex,          // Regex Tester - symbole regex
  Clock,          // Timestamp - horloge
  Palette,        // Color Converter - palette de couleurs
  KeyRound,       // JWT Decoder - clé de sécurité
  Hash,           // Hash Generator - symbole hash
  Link2,          // URL Encoder - maillon de chaîne
  FileText,       // Markdown Preview - document texte
  Type,           // Lorem Generator - lettre typographique
  QrCode,         // QR Generator - code QR
  Globe,          // API Tester - globe (requêtes web)
  CaseSensitive,  // Case Converter
  Lock,           // Password Generator
  Contrast,       // Contrast Checker
  GitCompare,     // Diff
  Calculator,     // Number base converter
  ListOrdered,    // Text / line utilities
} from 'lucide-react';

// Import du type ComponentType depuis React pour typer les composants dynamiques
import type { ComponentType } from 'react';

import type { Category, CategoryKey } from './categories';
import { categories, getCategory } from './categories';

// Ré-export pour que les consommateurs importent tout depuis '@/tools'
export { categories, getCategory } from './categories';
export type { Category, CategoryKey } from './categories';

// Import de tous les composants d'outils
import JsonFormatter from './json-formatter/JsonFormatter';
import Base64Tool from './base64/Base64Tool';
import UuidGenerator from './uuid/UuidGenerator';
import RegexTester from './regex/RegexTester';
import TimestampConverter from './timestamp/TimestampConverter';
import ColorConverter from './color/ColorConverter';
import JwtDecoder from './jwt/JwtDecoder';
import HashGenerator from './hash/HashGenerator';
import UrlTool from './url/UrlTool';
import MarkdownPreview from './markdown/MarkdownPreview';
import LoremGenerator from './lorem/LoremGenerator';
import QrCodeGenerator from './qrcode/QrCodeGenerator';
import ApiTester from './api-tester/ApiTester';
import CaseConverter from './case/CaseConverter';
import PasswordGenerator from './password/PasswordGenerator';
import ContrastChecker from './contrast/ContrastChecker';
import DiffTool from './diff/DiffTool';
import NumberBaseConverter from './number-base/NumberBaseConverter';
import TextUtils from './text-utils/TextUtils';

// Interface définissant la structure obligatoire de chaque outil du registre
export interface Tool {
  id: string;                                      // Identifiant unique (favoris, navigation, persistance)
  name: string;                                    // Nom affiché dans la sidebar et l'en-tête
  description: string;                              // Phrase courte affichée sous le titre dans l'en-tête de l'outil
  icon: ComponentType<{ className?: string }>;     // Composant icône lucide-react
  component: ComponentType;                        // Composant React de l'outil lui-même
  category: CategoryKey;                            // Catégorie (regroupement sidebar + couleur d'accent)
  keywords?: string[];                             // Termes supplémentaires pour la recherche et la palette de commandes
}

// Registre central de tous les outils disponibles
// La sidebar, la palette de commandes et le routing interne se basent UNIQUEMENT sur ce tableau.
// Pour ajouter un nouvel outil : créer le composant + l'ajouter ici avec sa catégorie.
export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Formatez, minifiez et validez rapidement votre JSON.',
    icon: Code2,
    component: JsonFormatter,
    category: 'data',
    keywords: ['json', 'formatter', 'beautify', 'minify', 'prettify', 'valider'],
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encodez ou décodez rapidement une chaîne Base64.',
    icon: Binary,
    component: Base64Tool,
    category: 'encoding',
    keywords: ['base64', 'encoder', 'decoder', 'encodage', 'atob', 'btoa'],
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Génère des identifiants UUID v4 uniques et aléatoires.',
    icon: Fingerprint,
    component: UuidGenerator,
    category: 'crypto',
    keywords: ['uuid', 'guid', 'identifiant', 'random', 'v4'],
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    description: 'Teste et visualise tes expressions régulières en temps réel.',
    icon: Regex,
    component: RegexTester,
    category: 'text',
    keywords: ['regex', 'regexp', 'expression', 'pattern', 'match'],
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convertis des timestamps Unix en dates lisibles et inversement.',
    icon: Clock,
    component: TimestampConverter,
    category: 'convert',
    keywords: ['timestamp', 'unix', 'epoch', 'date', 'heure', 'iso'],
  },
  {
    id: 'color',
    name: 'Color Converter',
    description: 'Convertissez une couleur entre HEX, RGB et HSL.',
    icon: Palette,
    component: ColorConverter,
    category: 'convert',
    keywords: ['couleur', 'color', 'hex', 'rgb', 'hsl', 'palette'],
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: "Analysez localement le header et le payload d'un token JWT.",
    icon: KeyRound,
    component: JwtDecoder,
    category: 'encoding',
    keywords: ['jwt', 'token', 'jsonwebtoken', 'auth', 'claims', 'décoder'],
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    description: "Générez plusieurs empreintes cryptographiques à partir d'un texte.",
    icon: Hash,
    component: HashGenerator,
    category: 'crypto',
    keywords: ['hash', 'sha', 'sha256', 'sha512', 'empreinte', 'checksum'],
  },
  {
    id: 'url',
    name: 'URL Encoder/Decoder',
    description: 'Encode ou décode rapidement des URLs et des paramètres.',
    icon: Link2,
    component: UrlTool,
    category: 'encoding',
    keywords: ['url', 'uri', 'encodeuricomponent', 'percent', 'query'],
  },
  {
    id: 'markdown',
    name: 'Markdown Preview',
    description: 'Écrivez du Markdown et visualisez instantanément son rendu.',
    icon: FileText,
    component: MarkdownPreview,
    category: 'data',
    keywords: ['markdown', 'md', 'readme', 'preview', 'aperçu', 'html'],
  },
  {
    id: 'lorem',
    name: 'Lorem Generator',
    description: 'Générez du texte fictif pour vos maquettes et prototypes.',
    icon: Type,
    component: LoremGenerator,
    category: 'text',
    keywords: ['lorem', 'ipsum', 'placeholder', 'texte', 'faux', 'remplissage'],
  },
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    description: 'Transformez une URL ou un texte en QR Code exportable.',
    icon: QrCode,
    component: QrCodeGenerator,
    category: 'web',
    keywords: ['qr', 'qrcode', 'code', 'scan', 'png', 'lien'],
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Testez vos endpoints HTTP directement depuis DevDesk.',
    icon: Globe,
    component: ApiTester,
    category: 'web',
    keywords: ['api', 'http', 'rest', 'requête', 'endpoint', 'curl', 'fetch'],
  },
  {
    id: 'case',
    name: 'Case Converter',
    description: 'Convertit un texte entre camelCase, snake_case, kebab-case…',
    icon: CaseSensitive,
    component: CaseConverter,
    category: 'text',
    keywords: ['casse', 'case', 'camel', 'snake', 'kebab', 'pascal', 'constant', 'slug'],
  },
  {
    id: 'password',
    name: 'Password Generator',
    description: 'Génère des mots de passe aléatoires forts, en local.',
    icon: Lock,
    component: PasswordGenerator,
    category: 'crypto',
    keywords: ['mot de passe', 'password', 'aléatoire', 'random', 'secret', 'entropie'],
  },
  {
    id: 'contrast',
    name: 'Contrast Checker',
    description: 'Vérifie le contraste de deux couleurs selon les critères WCAG.',
    icon: Contrast,
    component: ContrastChecker,
    category: 'convert',
    keywords: ['contraste', 'contrast', 'wcag', 'a11y', 'accessibilité', 'ratio', 'aa', 'aaa'],
  },
  {
    id: 'diff',
    name: 'Text Diff',
    description: 'Compare deux textes ligne à ligne et surligne les différences.',
    icon: GitCompare,
    component: DiffTool,
    category: 'text',
    keywords: ['diff', 'comparer', 'compare', 'différence', 'merge', 'patch'],
  },
  {
    id: 'number-base',
    name: 'Number Base Converter',
    description: 'Convertit un entier entre binaire, octal, décimal et hexadécimal.',
    icon: Calculator,
    component: NumberBaseConverter,
    category: 'convert',
    keywords: ['base', 'binaire', 'binary', 'hex', 'hexadécimal', 'octal', 'décimal', 'bits'],
  },
  {
    id: 'text-utils',
    name: 'Text & Line Utilities',
    description: 'Trie, déduplique, nettoie et compte des lignes de texte.',
    icon: ListOrdered,
    component: TextUtils,
    category: 'text',
    keywords: ['texte', 'lignes', 'trier', 'sort', 'dédupliquer', 'unique', 'compter', 'trim'],
  },
];

// Retourne un outil par son identifiant, ou undefined.
export function getTool(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}

// Groupe les outils par catégorie, dans l'ordre défini par `categories`.
// Les catégories sans aucun outil sont omises.
export function toolsByCategory(list: Tool[] = tools): { category: Category; tools: Tool[] }[] {
  return categories
    .map((category) => ({
      category,
      tools: list.filter((tool) => tool.category === category.key),
    }))
    .filter((group) => group.tools.length > 0);
}

// Classes Tailwind du chip d'icône d'un outil (dérivées de sa catégorie).
export function getToolChip(tool: Tool): string {
  return getCategory(tool.category).chip;
}

// Recherche floue simple sur nom + mots-clés, utilisée par la sidebar et la palette.
export function searchTools(query: string, list: Tool[] = tools): Tool[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;

  return list.filter((tool) => {
    const haystack = [tool.name, ...(tool.keywords ?? [])].join(' ').toLowerCase();
    return haystack.includes(q);
  });
}
