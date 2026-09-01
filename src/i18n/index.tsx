import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { fr } from './fr';
import { en } from './en';
import { toolsFr } from './tools.fr';
import { toolsEn } from './tools.en';
import { apiFr } from './api.fr';
import { apiEn } from './api.en';
import { uiFr } from './ui.fr';
import { uiEn } from './ui.en';

export type Locale = 'fr' | 'en';

const mergedFr = { ...fr, ...toolsFr, ...apiFr, ...uiFr };
const mergedEn = { ...en, ...toolsEn, ...apiEn, ...uiEn };

const DICTS: Record<Locale, Record<string, string>> = { fr: mergedFr, en: mergedEn };
const STORAGE_KEY = 'devdesk-locale';

export const LOCALES: { value: Locale; label: string }[] = [
  { value: 'fr', label: 'Français' },
  { value: 'en', label: 'English' },
];

function getInitialLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'fr' || stored === 'en') return stored;
  } catch {
    /* ignore */
  }
  return typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('en') ? 'en' : 'fr';
}

type Translate = (key: string, vars?: Record<string, string | number>) => string;

interface I18nValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: Translate;
}

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, locale);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = locale;
  }, [locale]);

  const t = useCallback<Translate>(
    (key, vars) => {
      let str = DICTS[locale][key] ?? mergedFr[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v));
      }
      return str;
    },
    [locale]
  );

  const value = useMemo<I18nValue>(() => ({ locale, setLocale: setLocaleState, t }), [locale, t]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n doit être utilisé dans <I18nProvider>');
  return ctx;
}

/** Raccourci quand on n'a besoin que de `t`. */
export function useT(): Translate {
  return useI18n().t;
}
