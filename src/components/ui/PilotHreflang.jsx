import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { localizedAlternatesByPath, localizedLanguageByPath } from '../../data/localizedPilot';

const OG_LOCALE = {
  'en-IN': 'en_IN',
  'hi-IN': 'hi_IN',
  'gu-IN': 'gu_IN',
};

export default function PilotHreflang() {
  const { pathname } = useLocation();
  const alternates = localizedAlternatesByPath[pathname];
  if (!alternates?.length) return null;

  const languageTag = localizedLanguageByPath[pathname] || 'en-IN';
  const htmlLang = languageTag.split('-')[0];
  const otherLocales = alternates
    .filter((item) => item.hreflang !== languageTag && item.hreflang !== 'x-default')
    .map((item) => OG_LOCALE[item.hreflang])
    .filter(Boolean);

  return (
    <Helmet>
      <html lang={htmlLang} />
      <meta property="og:locale" content={OG_LOCALE[languageTag] || 'en_IN'} />
      {otherLocales.map((locale) => <meta key={locale} property="og:locale:alternate" content={locale} />)}
      {alternates.map((item) => (
        <link key={item.hreflang} rel="alternate" hrefLang={item.hreflang} href={item.href} />
      ))}
    </Helmet>
  );
}
