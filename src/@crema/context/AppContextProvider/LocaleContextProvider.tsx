'use client';
import defaultConfig from '@/@crema/constants/DefaultConfig';
import { LanguageProps } from '@/@crema/types/models/Apps';
import React, { createContext, ReactNode, useContext, useState } from 'react';

export interface LocaleContextData {
  locale: LanguageProps;
  rtlLocale: string[];
}

export interface LocaleActionsData {
  updateLocale: (locale: LanguageProps) => void;
}

export const LocaleContext = createContext<LocaleContextData>({
  locale: defaultConfig.locale,
  rtlLocale: defaultConfig.rtlLocale,
});
export const LocaleActionsContext = createContext<LocaleActionsData>({
  updateLocale: () => undefined,
});

export const useLocaleContext = () => useContext(LocaleContext);

export const useLocaleActionsContext = () => useContext(LocaleActionsContext);

interface LocaleContextProviderProps {
  children: ReactNode;
}

const LocaleContextProvider: React.FC<LocaleContextProviderProps> = ({ children }) => {
  const [locale, updateLocale] = useState<LanguageProps>(defaultConfig.locale);

  return (
    <LocaleContext.Provider
      value={{
        locale,
        rtlLocale: defaultConfig.rtlLocale,
      }}
    >
      <LocaleActionsContext.Provider
        value={{
          updateLocale,
        }}
      >
        {children}
      </LocaleActionsContext.Provider>
    </LocaleContext.Provider>
  );
};

export default LocaleContextProvider;
