// État React persisté dans le localStorage du renderer.
// Utilisé par les outils "où l'on tape beaucoup" pour ne pas perdre la saisie
// en changeant d'outil ou en relançant l'application.
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

export function usePersistentState<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const storageKey = `devdesk-tool:${key}`;

  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch {
      /* localStorage indisponible : on ignore */
    }
  }, [storageKey, state]);

  return [state, setState];
}
