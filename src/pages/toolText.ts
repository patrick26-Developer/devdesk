// Helpers de clés i18n pour les métadonnées d'outils.
export const toolDescKey = (id: string) => `tool.${id}.desc`;
export const guideKey = (id: string, part: 'role' | 'need' | 'usage') => `guide.${id}.${part}`;
