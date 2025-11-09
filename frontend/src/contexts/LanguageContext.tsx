import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, supportedLocales } from '../config/i18n';

type Locale = typeof supportedLocales[number];

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => Promise<void>;
  t: (key: string, params?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'appLanguage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved && supportedLocales.includes(saved as Locale)) {
        setLocaleState(saved as Locale);
      }
    } catch (error) {
      console.error('Error loading saved language:', error);
    }
  };

  const setLocale = useCallback(async (newLocale: Locale) => {
    try {
      console.log('🌍 Setting locale to:', newLocale);
      await AsyncStorage.setItem(STORAGE_KEY, newLocale);
      setLocaleState(newLocale);
      console.log('✅ Locale set successfully:', newLocale);
    } catch (error) {
      console.error('Error saving language:', error);
    }
  }, []);

  const t = useCallback((key: string, params?: Record<string, string>): string => {
    const keys = key.split('.');
    let value: any = translations[locale];

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k];
      } else {
        value = translations['en'];
        for (const k of keys) {
          if (value && typeof value === 'object') {
            value = value[k];
          } else {
            return key;
          }
        }
        break;
      }
    }

    if (typeof value === 'string') {
      if (params) {
        Object.keys(params).forEach((paramKey) => {
          value = value.replace(`{{${paramKey}}}`, params[paramKey]);
        });
      }
      return value;
    }

    return key;
  }, [locale]);

  const value = useMemo(() => ({
    locale,
    setLocale,
    t
  }), [locale, setLocale, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
