// Bouton de copie unifié pour toute l'application.
// Remplace les ~10 implémentations divergentes (icône seule, libellée, "Clipboard" vs "Copy"...).
// Icône Copy -> Check pendant 1,5 s. Un `aria-label` est toujours présent.

import { useCallback, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { notify } from '@/lib/notify';
import { useT } from '@/i18n';

interface CopyButtonProps {
  value: string;
  // Si défini, le bouton affiche ce libellé à côté de l'icône. Sinon, icône seule.
  label?: string;
  // Libellé affiché pendant l'état "copié" (défaut : "Copié").
  copiedLabel?: string;
  disabled?: boolean;
  variant?: 'ghost' | 'secondary' | 'outline';
  size?: 'sm' | 'icon-sm';
  className?: string;
  // Message affiché dans le toast après copie. `false` désactive le toast.
  toastMessage?: string | false;
  // Appelé après une copie réussie.
  onCopied?: (value: string) => void;
}

export default function CopyButton({
  value,
  label,
  copiedLabel,
  disabled,
  variant = 'ghost',
  size,
  className,
  toastMessage,
  onCopied,
}: CopyButtonProps) {
  const t = useT();
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resolvedCopiedLabel = copiedLabel ?? t('common.copied');

  const copy = useCallback(async () => {
    if (!value) return;

    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return;
    }

    setCopied(true);
    onCopied?.(value);
    if (toastMessage !== false) notify(toastMessage ?? t('common.copiedClipboard'));

    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1500);
  }, [value, onCopied, toastMessage, t]);

  const iconOnly = !label;
  const resolvedSize = size ?? (iconOnly ? 'icon-sm' : 'sm');

  return (
    <Button
      type="button"
      variant={variant}
      size={resolvedSize}
      onClick={copy}
      disabled={disabled || !value}
      aria-label={label ? undefined : copied ? resolvedCopiedLabel : t('common.copy')}
      className={cn('gap-1.5', className)}
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
      {label ? <span>{copied ? resolvedCopiedLabel : label}</span> : null}
    </Button>
  );
}
