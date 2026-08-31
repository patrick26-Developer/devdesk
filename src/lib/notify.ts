// Petit utilitaire de notification (toast) pour toute l'application.
// S'appuie sur le gestionnaire de toasts de @/components/ui/toast, monté une fois dans main.tsx.

import { toast } from '@/components/ui/toast';

type NotifyType = 'success' | 'error' | 'info' | 'warning';

interface NotifyOptions {
  description?: string;
  type?: NotifyType;
}

export function notify(title: string, options: NotifyOptions = {}) {
  toast.add({
    title,
    description: options.description,
    type: options.type ?? 'success',
  });
}
