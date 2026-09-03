// Central policy for future advertising. No ad provider is loaded yet.
// When AdSense is approved, ad components should call isAdEligiblePath()
// before rendering or requesting an ad. Keep sensitive, private and
// conversion-focused experiences ad-free by default.

const NEVER_AD_PREFIXES = [
  '/admin',
  '/dashboard',
  '/login',
  '/onboarding',
  '/my-data',
  '/learning-insights',
  '/book-demo',
  '/demo-success',
  '/contact',
  '/marks-recovery',
  '/exam-mode',
  '/daily-practice',
  '/test-series',
  '/tests/',
  '/pdf-viewer',
  '/reel',
];

const CONTENT_ALLOWLIST = [
  /^\/$/,
  /^\/tools(?:\/|$)/,
  /^\/cbse-notes$/,
  /^\/cbse-practice$/,
  /^\/cbse-pyq$/,
  /^\/study-material$/,
  /^\/cbse\//,
  /^\/practice\/cbse\//,
  /^\/gseb-/,
];

export function isAdEligiblePath(pathname = '') {
  const path = String(pathname || '/').split('?')[0];
  if (NEVER_AD_PREFIXES.some((prefix) => path === prefix || path.startsWith(prefix))) return false;
  return CONTENT_ALLOWLIST.some((pattern) => pattern.test(path));
}

export const adPolicy = {
  providerEnabled: false,
  provider: 'Google AdSense',
  rules: {
    contentOnly: true,
    privateAreas: false,
    admissionFunnels: false,
    diagnostics: false,
    activeTests: false,
  },
};
