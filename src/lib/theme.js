// Routes that render in the light "Ledger" editorial theme.
// App-like tools (games, flashcards, dashboards, AI doubt) stay dark by design.
export const LIGHT_ROUTES = [
  "/",
  "/courses",
  "/concept-lab",
  "/lectures",
  "/study-material",
  "/services-for-teachers",
  "/board-exam-diagnostic",
  "/board-booster-packs",
  "/cbse-notes",
  "/cbse-practice",
  "/cbse-pyq",
  "/quizzes",
  "/test-series",
  "/live-classes",
  "/online-batch",
  "/offline-batch",
  "/book-demo",
  "/demo-success",
  "/about",
  "/contact",
  "/faq",
  "/parent-info",
];

export function isLightRoute(pathname) {
  return (
    LIGHT_ROUTES.includes(pathname) ||
    pathname.startsWith("/cbse/") ||
    pathname.endsWith("-diagnostic-test") ||
    pathname.startsWith("/practice/cbse/") ||
    pathname === "/pdf-viewer"
  );
}

export function mobileStudySection(pathname, search = '') {
  if (pathname === '/study-material') return new URLSearchParams(search).get('view') === 'downloads' ? 'downloads' : 'notes';
  if (pathname === '/quizzes' || pathname.startsWith('/practice/cbse/')) return 'quizzes';
  if (pathname === '/lectures') return 'lectures';
  if (pathname === '/test-series') return 'tests';
  if (pathname === '/study-coach') return 'plan';
  return '';
}
