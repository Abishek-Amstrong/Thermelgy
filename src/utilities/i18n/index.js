import * as RNLocalize from 'react-native-localize';
import I18n from 'i18n-js';

// import memoize from 'lodash.memoize'; // Use for caching/memoize for better performance


import en from './locales/en';
import fr from './locales/fr';
// import zh from './zh';
// import vn from './vn';
// import vi from './vi';
// import ko from './ko';
// import nl from './nl';

const locales = RNLocalize.getLocales();
if (Array.isArray(locales)) {
  I18n.locale = locales[0].languageTag;
}

I18n.translations = {
  default: en,
  'en-US': en,
  en,
  fr
//   vi,
//   nl,
//   'nl-NL': nl,
//   zh,
//   'vi-VN': vi,
//   ko,
};

I18n.fallbacks = true;
export default I18n;
