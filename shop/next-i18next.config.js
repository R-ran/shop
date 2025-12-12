const invariant = require('tiny-invariant');
const path = require('path');

// 在构建时设置 NEXTAUTH_URL，确保 next-auth 可以正常工作
if (!process.env.NEXTAUTH_URL) {
  if (process.env.VERCEL_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
  } else if (process.env.NEXT_PUBLIC_SITE_URL) {
    process.env.NEXTAUTH_URL = process.env.NEXT_PUBLIC_SITE_URL;
  } else if (process.env.VERCEL) {
    process.env.NEXTAUTH_URL = 'https://placeholder.vercel.app';
  } else {
    process.env.NEXTAUTH_URL = 'http://localhost:3003';
  }
}

invariant(
  process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE,
  'NEXT_PUBLIC_DEFAULT_LANGUAGE is required, but not set, check your .env file'
);

const isMultilangEnable =
  process.env.NEXT_PUBLIC_ENABLE_MULTI_LANG === 'true' &&
  !!process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES;

function generateLocales() {
  if (isMultilangEnable) {
    return process.env.NEXT_PUBLIC_AVAILABLE_LANGUAGES.split(',');
  }

  return [process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE];
}

module.exports = {
  i18n: {
    defaultLocale: process.env.NEXT_PUBLIC_DEFAULT_LANGUAGE ?? 'en',
    locales: generateLocales(),
  },
  react: { useSuspense: false },
  localePath: path.resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
