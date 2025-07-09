// src/i18n/index.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Asegúrate de tener "resolveJsonModule": true en tu tsconfig.json
import es from './es.json';
import en from './en.json';

i18n
  .use(initReactI18next) // pasa i18n al hook de react
  .init({
    resources: {
      es: { translation: es },
      en: { translation: en }
    },
    // idioma por defecto
    lng: 'es',
    // si no encuentra la clave en el idioma actual, usa este
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false // react ya se encarga del escape
    }
  });

export default i18n;
