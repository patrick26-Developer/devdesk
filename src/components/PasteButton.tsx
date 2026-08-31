// Bouton « Coller depuis le presse-papiers ». Silencieux si le presse-papiers est inaccessible.
import { ClipboardPaste } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PasteButtonProps {
  onPaste: (text: string) => void;
  label?: string;
  className?: string;
}

export default function PasteButton({ onPaste, label = 'Coller', className }: PasteButtonProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={async () => {
        try {
          const text = await navigator.clipboard.readText();
          if (text) onPaste(text);
        } catch {
          /* presse-papiers inaccessible */
        }
      }}
      className={cn('gap-1.5 text-muted-foreground hover:text-foreground', className)}
    >
      <ClipboardPaste className="h-3.5 w-3.5" />
      {label}
    </Button>
  );
}
