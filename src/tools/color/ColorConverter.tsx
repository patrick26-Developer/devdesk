// useMemo : recalcule RGB/HSL uniquement lorsque la couleur HEX change
// useState : conserve la couleur HEX comme source de vérité unique
import { useMemo, useState } from 'react';

import {
  Check,
  Clipboard,
  Copy,
  Palette,
  RotateCcw,
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

// =========================================================
// CONVERSION HEX → RGB
// =========================================================

function hexToRgb(hex: string) {
  // Retire le caractère # avant de lire les composantes
  const clean = hex.replace('#', '');

  // Extrait chaque paire hexadécimale
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);

  return { r, g, b };
}

// =========================================================
// CONVERSION RGB → HSL
// =========================================================

function rgbToHsl(r: number, g: number, b: number) {
  // Normalise les valeurs RGB entre 0 et 1
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0;
  let s = 0;

  const l = (max + min) / 2;

  // Si max === min, la couleur est un gris
  if (max !== min) {
    const d = max - min;

    s =
      l > 0.5
        ? d / (2 - max - min)
        : d / (max + min);

    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;

      case g:
        h = (b - r) / d + 2;
        break;

      case b:
        h = (r - g) / d + 4;
        break;
    }

    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

// =========================================================
// COMPOSANT
// =========================================================

export default function ColorConverter() {
  // Source de vérité unique
  const [hex, setHex] = useState('#3b82f6');

  // État utilisé pour indiquer qu'une valeur vient d'être copiée
  const [copied, setCopied] = useState<string | null>(null);

  // Vérifie si le HEX est valide
  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);

  // Recalcule les représentations uniquement lorsque HEX change
  const { rgb, hsl } = useMemo(() => {
    if (!isValidHex) {
      return {
        rgb: null,
        hsl: null,
      };
    }

    const rgbValue = hexToRgb(hex);

    const hslValue = rgbToHsl(
      rgbValue.r,
      rgbValue.g,
      rgbValue.b
    );

    return {
      rgb: rgbValue,
      hsl: hslValue,
    };
  }, [hex, isValidHex]);

  // =========================================================
  // COPIE
  // =========================================================

  const copyValue = async (
    value: string,
    type: string
  ) => {
    await navigator.clipboard.writeText(value);

    setCopied(type);

    setTimeout(() => {
      setCopied(null);
    }, 1500);
  };

  // =========================================================
  // RESET
  // =========================================================

  const reset = () => {
    setHex('#3b82f6');
    setCopied(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col gap-5 p-6 xl:p-8">

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-500/15 bg-rose-500/10">
            <Palette className="h-5 w-5 text-rose-500" />
          </div>

          <div>
            <h2 className="text-base font-semibold text-foreground">
              Color Converter
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Convertissez une couleur entre HEX, RGB et HSL.
            </p>
          </div>

        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="w-fit gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>

      </div>

      {/* =========================================================
          COLOR PICKER
      ========================================================= */}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">

        {/* PREVIEW */}

        <div className="overflow-hidden rounded-xl border border-border bg-card">

          <div className="border-b border-border px-4 py-3">

            <p className="text-sm font-medium">
              Aperçu
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Couleur sélectionnée
            </p>

          </div>

          <div
            className="m-4 h-36 rounded-lg border border-border shadow-inner"
            style={{
              backgroundColor: isValidHex
                ? hex
                : '#000000',
            }}
          />

          <div className="border-t border-border px-4 py-3">

            <p className="font-mono text-xs text-muted-foreground">
              {isValidHex ? hex.toUpperCase() : 'HEX invalide'}
            </p>

          </div>

        </div>

        {/* INPUT */}

        <div className="rounded-xl border border-border bg-card p-4">

          <div className="mb-4">

            <p className="text-sm font-medium">
              Sélectionner une couleur
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Utilisez le sélecteur natif ou saisissez directement
              une valeur HEX.
            </p>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="color"
              value={isValidHex ? hex : '#000000'}
              onChange={(e) => setHex(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-border bg-background p-1 sm:h-11 sm:w-20"
              title="Sélectionner une couleur"
            />

            <div className="relative flex-1">

              <Input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#3b82f6"
                className="h-11 pr-20 font-mono text-sm"
              />

              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
                HEX
              </span>

            </div>

          </div>

          {!isValidHex && (
            <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              Format invalide. Utilisez le format
              <span className="ml-1 font-mono font-semibold">
                #rrggbb
              </span>
              .
            </div>
          )}

        </div>

      </div>

      {/* =========================================================
          CONVERSIONS
      ========================================================= */}

      {rgb && hsl && (
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-3">

          {/* HEX */}

          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">

            <div className="flex items-center justify-between border-b border-border px-4 py-3">

              <div>
                <p className="text-sm font-medium">
                  HEX
                </p>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Hexadecimal
                </p>
              </div>

              <span className="rounded-md bg-rose-500/10 px-2 py-1 text-[10px] font-semibold text-rose-500">
                #RRGGBB
              </span>

            </div>

            <div className="flex flex-1 items-center justify-between gap-3 p-4">

              <code className="break-all font-mono text-sm">
                {hex.toUpperCase()}
              </code>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyValue(hex.toUpperCase(), 'hex')
                }
                className="shrink-0 gap-1.5"
              >
                {copied === 'hex' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>

            </div>

          </div>

          {/* RGB */}

          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">

            <div className="flex items-center justify-between border-b border-border px-4 py-3">

              <div>
                <p className="text-sm font-medium">
                  RGB
                </p>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Red Green Blue
                </p>
              </div>

              <span className="rounded-md bg-blue-500/10 px-2 py-1 text-[10px] font-semibold text-blue-500">
                0 — 255
              </span>

            </div>

            <div className="flex flex-1 items-center justify-between gap-3 p-4">

              <code className="break-all font-mono text-sm">
                rgb({rgb.r}, {rgb.g}, {rgb.b})
              </code>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyValue(
                    `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
                    'rgb'
                  )
                }
                className="shrink-0 gap-1.5"
              >
                {copied === 'rgb' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>

            </div>

          </div>

          {/* HSL */}

          <div className="flex flex-col overflow-hidden rounded-xl border border-border bg-card">

            <div className="flex items-center justify-between border-b border-border px-4 py-3">

              <div>
                <p className="text-sm font-medium">
                  HSL
                </p>

                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  Hue Saturation Lightness
                </p>
              </div>

              <span className="rounded-md bg-violet-500/10 px-2 py-1 text-[10px] font-semibold text-violet-500">
                0 — 360°
              </span>

            </div>

            <div className="flex flex-1 items-center justify-between gap-3 p-4">

              <code className="break-all font-mono text-sm">
                hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
              </code>

              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  copyValue(
                    `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
                    'hsl'
                  )
                }
                className="shrink-0 gap-1.5"
              >
                {copied === 'hsl' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-500" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
              </Button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}