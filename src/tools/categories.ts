// Catégories d'outils : source unique pour le regroupement dans la sidebar,
// la couleur d'accent de chaque outil (chip d'icône) et les en-têtes de section.
// Un outil appartient à exactement une catégorie (champ `category` du registre).

export type CategoryKey =
  | 'data'
  | 'encoding'
  | 'crypto'
  | 'convert'
  | 'web'
  | 'text';

export interface Category {
  key: CategoryKey;
  label: string;
  // Classes Tailwind du chip d'icône affiché dans l'en-tête de l'outil (fond + bordure + texte)
  chip: string;
  // Classes Tailwind de la pastille de couleur affichée à côté du titre de section dans la sidebar
  dot: string;
}

// L'ordre de ce tableau détermine l'ordre des sections dans la sidebar.
export const categories: Category[] = [
  {
    key: 'data',
    label: 'Données & formats',
    chip: 'bg-violet-500/10 border-violet-500/15 text-violet-500',
    dot: 'bg-violet-500',
  },
  {
    key: 'encoding',
    label: 'Encodage & tokens',
    chip: 'bg-fuchsia-500/10 border-fuchsia-500/15 text-fuchsia-500',
    dot: 'bg-fuchsia-500',
  },
  {
    key: 'crypto',
    label: 'Sécurité',
    chip: 'bg-red-500/10 border-red-500/15 text-red-500',
    dot: 'bg-red-500',
  },
  {
    key: 'convert',
    label: 'Convertisseurs',
    chip: 'bg-emerald-500/10 border-emerald-500/15 text-emerald-500',
    dot: 'bg-emerald-500',
  },
  {
    key: 'web',
    label: 'Web & réseau',
    chip: 'bg-cyan-500/10 border-cyan-500/15 text-cyan-500',
    dot: 'bg-cyan-500',
  },
  {
    key: 'text',
    label: 'Texte',
    chip: 'bg-amber-500/10 border-amber-500/15 text-amber-500',
    dot: 'bg-amber-500',
  },
];

const CATEGORY_BY_KEY: Record<CategoryKey, Category> = categories.reduce(
  (acc, category) => {
    acc[category.key] = category;
    return acc;
  },
  {} as Record<CategoryKey, Category>
);

export function getCategory(key: CategoryKey): Category {
  return CATEGORY_BY_KEY[key];
}
