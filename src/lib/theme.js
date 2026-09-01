// Routes that render in the light "Ledger" editorial theme.
// App-like tools (games, flashcards, dashboards, AI doubt) stay dark by design.
export const LIGHT_ROUTES = [
  '/',
  '/courses',
  '/lectures',
  '/study-material',
  '/cbse-notes',
  '/cbse-practice',
  '/cbse-pyq',
  '/quizzes',
  '/test-series',
  '/live-classes',
  '/online-batch',
  '/offline-batch',
  '/book-demo',
  '/demo-success',
  '/about',
  '/contact',
  '/faq',
  '/parent-info',
];

export function isLightRoute(pathname) {
  return LIGHT_ROUTES.includes(pathname)
    || pathname.startsWith('/cbse/')
    || pathname.startsWith('/practice/cbse/')
    || pathname === '/pdf-viewer';
}
