// useState : état local pour la couleur courante (stockée en interne au format HEX, source de vérité unique)
// useMemo : recalcule les représentations RGB/HSL uniquement quand le HEX change
import { useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';

// Convertit une couleur HEX (#rrggbb) en objet RGB { r, g, b }, chaque canal de 0 à 255
function hexToRgb(hex: string) {
  // Retire le # s'il est présent, puis extrait chaque paire de caractères hexadécimaux
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return { r, g, b };
}

// Convertit du RGB (0-255 chacun) en HSL (teinte 0-360, saturation/luminosité en %)
// Algorithme standard de conversion colorimétrique
function rgbToHsl(r: number, g: number, b: number) {
  // Normalise les canaux entre 0 et 1
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  // Si max === min, la couleur est un gris pur : pas de teinte ni de saturation
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  // Source de vérité unique : la couleur au format HEX. Tous les autres formats en sont dérivés.
  const [hex, setHex] = useState('#3b82f6');

  // Recalcule RGB et HSL uniquement quand le HEX change (évite des recalculs inutiles à chaque render)
  const { rgb, hsl } = useMemo(() => {
    // Valide grossièrement le format avant de convertir (évite NaN affichés si l'utilisateur tape n'importe quoi)
    const isValid = /^#[0-9A-Fa-f]{6}$/.test(hex);
    if (!isValid) return { rgb: null, hsl: null };

    const rgbValue = hexToRgb(hex);
    const hslValue = rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b);
    return { rgb: rgbValue, hsl: hslValue };
  }, [hex]);

  return (
    <div className="flex flex-col h-full p-6 gap-4 max-w-xl">
      <h2 className="text-lg font-semibold">Color Converter</h2>

      {/* Sélecteur de couleur natif + champ texte HEX, synchronisés sur le même état */}
      <div className="flex gap-3 items-center">
        {/* input type="color" : color picker natif du navigateur/OS, pas besoin de librairie externe */}
        <input
          type="color"
          value={/^#[0-9A-Fa-f]{6}$/.test(hex) ? hex : '#000000'}
          onChange={(e) => setHex(e.target.value)}
          className="h-10 w-14 rounded cursor-pointer border"
        />
        <Input
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          placeholder="#3b82f6"
          className="font-mono"
        />
      </div>

      {/* N'affiche les conversions que si le HEX saisi est valide */}
      {rgb && hsl ? (
        <div className="grid grid-cols-1 gap-2 font-mono text-sm">
          <div className="bg-muted/30 rounded-md p-3">HEX : {hex}</div>
          <div className="bg-muted/30 rounded-md p-3">RGB : rgb({rgb.r}, {rgb.g}, {rgb.b})</div>
          <div className="bg-muted/30 rounded-md p-3">HSL : hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</div>
        </div>
      ) : (
        <p className="text-sm text-destructive">Format HEX invalide (attendu : #rrggbb)</p>
      )}
    </div>
  );
}