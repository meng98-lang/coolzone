// EU Languages configuration
export const locales = [
  'en', // English (default)
  'fr', // French
  'de', // German
  'es', // Spanish
  'it', // Italian
  'nl', // Dutch
  'pt', // Portuguese
  'pl', // Polish
  'sv', // Swedish
  'da', // Danish
  'fi', // Finnish
  'cs', // Czech
  'ro', // Romanian
  'hu', // Hungarian
  'el', // Greek
  'bg', // Bulgarian
  'hr', // Croatian
  'sk', // Slovak
  'sl', // Slovenian
  'lt', // Lithuanian
  'lv', // Latvian
  'et', // Estonian
  'mt', // Maltese
  'ga', // Irish
] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

// Language names in their native form
export const languageNames: Record<Locale, string> = {
  en: 'English',
  fr: 'Français',
  de: 'Deutsch',
  es: 'Español',
  it: 'Italiano',
  nl: 'Nederlands',
  pt: 'Português',
  pl: 'Polski',
  sv: 'Svenska',
  da: 'Dansk',
  fi: 'Suomi',
  cs: 'Čeština',
  ro: 'Română',
  hu: 'Magyar',
  el: 'Ελληνικά',
  bg: 'Български',
  hr: 'Hrvatski',
  sk: 'Slovenčina',
  sl: 'Slovenščina',
  lt: 'Lietuvių',
  lv: 'Latviešu',
  et: 'Eesti',
  mt: 'Malti',
  ga: 'Gaeilge',
};

// Country flags (emoji)
export const languageFlags: Record<Locale, string> = {
  en: '🇬🇧',
  fr: '🇫🇷',
  de: '🇩🇪',
  es: '🇪🇸',
  it: '🇮🇹',
  nl: '🇳🇱',
  pt: '🇵🇹',
  pl: '🇵🇱',
  sv: '🇸🇪',
  da: '🇩🇰',
  fi: '🇫🇮',
  cs: '🇨🇿',
  ro: '🇷🇴',
  hu: '🇭🇺',
  el: '🇬🇷',
  bg: '🇧🇬',
  hr: '🇭🇷',
  sk: '🇸🇰',
  sl: '🇸🇮',
  lt: '🇱🇹',
  lv: '🇱🇻',
  et: '🇪🇪',
  mt: '🇲🇹',
  ga: '🇮🇪',
};

// Primary markets (prioritize these for translations)
export const primaryLocales: Locale[] = ['en', 'fr', 'de', 'es', 'it', 'nl'];
