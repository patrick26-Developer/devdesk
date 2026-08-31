import { useMemo, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ToolShell from '@/components/tool/ToolShell';
import { Panel, PanelHeader } from '@/components/tool/Panel';
import CopyButton from '@/components/CopyButton';
import { getTool } from '@/tools';
import { RotateCcw } from 'lucide-react';

function hexToRgb(hex: string) {
  const clean = hex.replace('#', '');
  return {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
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

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export default function ColorConverter() {
  const tool = getTool('color')!;
  const [hex, setHex] = useState('#3b82f6');

  const isValidHex = /^#[0-9A-Fa-f]{6}$/.test(hex);

  const { rgb, hsl } = useMemo(() => {
    if (!isValidHex) return { rgb: null, hsl: null };
    const rgbValue = hexToRgb(hex);
    return { rgb: rgbValue, hsl: rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b) };
  }, [hex, isValidHex]);

  return (
    <ToolShell
      tool={tool}
      actions={
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setHex('#3b82f6')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Réinitialiser
        </Button>
      }
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        <Panel>
          <PanelHeader title="Aperçu" subtitle="Couleur sélectionnée" />
          <div
            className="m-4 h-36 rounded-lg border border-border shadow-inner"
            style={{ backgroundColor: isValidHex ? hex : '#000000' }}
          />
          <div className="border-t border-border px-4 py-3">
            <p className="font-mono text-xs text-muted-foreground">
              {isValidHex ? hex.toUpperCase() : 'HEX invalide'}
            </p>
          </div>
        </Panel>

        <Panel className="p-4">
          <div className="mb-4">
            <p className="text-sm font-medium">Sélectionner une couleur</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Utilisez le sélecteur natif ou saisissez directement une valeur HEX.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              type="color"
              value={isValidHex ? hex : '#000000'}
              onChange={(e) => setHex(e.target.value)}
              className="h-11 w-full cursor-pointer rounded-lg border border-border bg-background p-1 sm:w-20"
              aria-label="Sélecteur de couleur"
            />
            <div className="relative flex-1">
              <Input
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#3b82f6"
                className="h-11 pr-16 font-mono text-sm"
                aria-label="Valeur hexadécimale"
              />
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-muted-foreground">
                HEX
              </span>
            </div>
          </div>

          {!isValidHex && (
            <div className="mt-3 rounded-lg border border-destructive/20 bg-destructive/5 px-3 py-2 text-xs text-destructive">
              Format invalide. Utilisez le format
              <span className="ml-1 font-mono font-semibold">#rrggbb</span>.
            </div>
          )}
        </Panel>
      </div>

      {rgb && hsl && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <ValueCard
            title="HEX"
            subtitle="Hexadecimal"
            badge="#RRGGBB"
            value={hex.toUpperCase()}
          />
          <ValueCard
            title="RGB"
            subtitle="Red Green Blue"
            badge="0 — 255"
            value={`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}
          />
          <ValueCard
            title="HSL"
            subtitle="Hue Saturation Lightness"
            badge="0 — 360°"
            value={`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}
          />
        </div>
      )}
    </ToolShell>
  );
}

function ValueCard({
  title,
  subtitle,
  badge,
  value,
}: {
  title: string;
  subtitle: string;
  badge: string;
  value: string;
}) {
  return (
    <Panel>
      <PanelHeader
        title={title}
        subtitle={subtitle}
        right={
          <span className="rounded-md bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
            {badge}
          </span>
        }
      />
      <div className="flex items-center justify-between gap-3 p-4">
        <code className="break-all font-mono text-sm">{value}</code>
        <CopyButton value={value} />
      </div>
    </Panel>
  );
}
