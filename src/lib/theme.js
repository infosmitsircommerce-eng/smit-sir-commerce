// Routes that render in the light "Ledger" editorial theme.
// App-like tools (games, flashcards, dashboards, AI doubt) stay dark by design.
export const LIGHT_ROUTES = [
  '/',
  '/courses',
  '/lectures',
  '/study-material',
  '/quizzes',
  '/test-series',
  '/live-classes',
  '/online-batch',
  '/offline-batch',
  '/about',
  '/contact',
  '/faq',
  '/parent-info',
];

export function isLightRoute(pathname) {
  return LIGHT_ROUTES.includes(pathname);
}
