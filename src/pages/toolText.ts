// Helpers de clés i18n pour les métadonnées d'outils.
export const toolDescKey = (id: string) => `tool.${id}.desc`;

export type GuidePart = 'role' | 'need' | 'steps' | 'details' | 'tip';
export const guideKey = (id: string, part: GuidePart) => `guide.${id}.${part}`;
