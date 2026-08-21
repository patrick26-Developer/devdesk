// Import des icônes lucide-react pour chaque outil de la sidebar
// Chaque icône est un composant React qui accepte une prop className optionnelle
import { 
  Code2,       // JSON Formatter - accolades de code
  Binary,      // Base64 - symboles binaires
  Fingerprint, // UUID - empreinte digitale (unicité)
  Regex,       // Regex Tester - symbole regex
  Clock,       // Timestamp - horloge
  Palette,     // Color Converter - palette de couleurs
  KeyRound,    // JWT Decoder - clé de sécurité
  Hash,        // Hash Generator - symbole hash
  Link2,       // URL Encoder - maillon de chaîne
  FileText,    // Markdown Preview - document texte
  Type,        // Lorem Generator - lettre typographique
  QrCode,      // QR Generator - code QR
  Globe        // API Tester - globe (requêtes web)
} from 'lucide-react';

// Import du type ComponentType depuis React pour typer les composants dynamiques
import type { ComponentType } from 'react';

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

// Interface définissant la structure obligatoire de chaque outil du registre
export interface Tool {
  id: string;                                      // Identifiant unique (utilisé pour les favoris, la navigation)
  name: string;                                    // Nom affiché dans la sidebar
  icon: ComponentType<{ className?: string }>;     // Composant icône lucide-react
  component: ComponentType;                        // Composant React de l'outil lui-même
}

// Registre central de tous les outils disponibles
// La sidebar et le routing interne se basent UNIQUEMENT sur ce tableau
// Pour ajouter un nouvel outil : créer le composant + l'ajouter ici
export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    icon: Code2,
    component: JsonFormatter,
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    icon: Binary,
    component: Base64Tool,
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    icon: Fingerprint,
    component: UuidGenerator,
  },
  {
    id: 'regex',
    name: 'Regex Tester',
    icon: Regex,
    component: RegexTester,
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    icon: Clock,
    component: TimestampConverter,
  },
  {
    id: 'color',
    name: 'Color Converter',
    icon: Palette,
    component: ColorConverter,
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    icon: KeyRound,
    component: JwtDecoder,
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    icon: Hash,
    component: HashGenerator,
  },
  {
    id: 'url',
    name: 'URL Encoder/Decoder',
    icon: Link2,
    component: UrlTool,
  },
  {
    id: 'markdown',
    name: 'Markdown Preview',
    icon: FileText,
    component: MarkdownPreview,
  },
  {
    id: 'lorem',
    name: 'Lorem Generator',
    icon: Type,
    component: LoremGenerator,
  },
  {
    id: 'qrcode',
    name: 'QR Code Generator',
    icon: QrCode,
    component: QrCodeGenerator,
  },
  {
    id: 'api-tester',
    name: 'API Tester',
    icon: Globe,
    component: ApiTester,
  },
];