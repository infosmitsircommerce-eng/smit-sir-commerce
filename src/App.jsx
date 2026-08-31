import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Outlet } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import InstallPWA from './components/ui/InstallPWA';
import Layout from './components/layout/Layout';
import PageTransition from './components/ui/PageTransition';
import SEO from './components/ui/SEO';
import { AuthProvider } from './context/AuthContext';

// Code-split every page — only loads what the user visits
const Home            = lazy(() => import('./pages/Home'));
const Login           = lazy(() => import('./pages/Login'));
const Courses         = lazy(() => import('./pages/Courses'));
const Lectures        = lazy(() => import('./pages/Lectures'));
const StudyMaterial   = lazy(() => import('./pages/StudyMaterial'));
const PdfViewer       = lazy(() => import('./pages/PdfViewer'));
const SeoMaterialHub  = lazy(() => import('./pages/SeoMaterialHub'));
const SeoMaterialChapter = lazy(() => import('./pages/SeoMaterialChapter'));
const CbseNotes       = lazy(() => import('./pages/CbseNotes'));
const Quizzes         = lazy(() => import('./pages/Quizzes'));
const TestSeries      = lazy(() => import('./pages/TestSeriesPro'));
const DailyPractice   = lazy(() => import('./pages/DailyPractice'));
const StudyCoach      = lazy(() => import('./pages/StudyCoach'));
const LiveClasses     = lazy(() => import('./pages/LiveClasses'));
const BatchPage       = lazy(() => import('./pages/BatchPage'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const AdminDashboard  = lazy(() => import('./pages/AdminDashboard'));
const Games           = lazy(() => import('./pages/Games'));
const Flashcards      = lazy(() => import('./pages/Flashcards'));
const AskDoubt        = lazy(() => import('./pages/AskDoubt'));
const ReelGenerator   = lazy(() => import('./pages/ReelGenerator'));
const ParentInfo      = lazy(() => import('./pages/ParentInfo'));
const About           = lazy(() => import('./pages/About'));
const Contact         = lazy(() => import('./pages/Contact'));
const FAQ             = lazy(() => import('./pages/FAQ'));

function ScrollToTopOnNav() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-8xl font-bold text-gold-400 mb-4">404</div>
        <div className="text-white text-xl mb-2">Page Not Found</div>
        <p className="text-navy-400 mb-6">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn-primary">Go to Home</Link>
      </div>
    </div>
  );
}

function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-ivory)' }} role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 animate-spin"
          style={{ borderColor: 'rgba(184,135,47,0.25)', borderTopColor: 'var(--gold)' }} />
        <p className="text-sm" style={{ color: 'var(--subtle)' }}>Loading this page…</p>
      </div>
    </div>
  );
}

const ROUTE_SEO = {
  '/': { title: 'Class 11 & 12 CBSE Commerce Coaching Mehsana', description: 'CBSE Commerce coaching for Class 11 and 12 in Mehsana, Gujarat, with free chapter-wise PDF notes and a free demo class.' },
  '/courses': { title: 'CBSE Commerce Courses — Class 11 & 12', description: 'Explore CBSE Class 11 and 12 Commerce subjects.' },
  '/lectures': { title: 'CBSE Commerce Video Lectures — Coming Soon', description: 'The video library is being prepared. Use the published PDF notes in the meantime.', noindex: true },
  '/study-material': { title: 'Free CBSE Commerce PDF Notes — Class 11 & 12', description: 'Download and view 26 free chapter-wise CBSE Commerce PDFs.' },
  '/quizzes': { title: 'CBSE Commerce Quizzes and Practice', description: 'Practice Commerce concepts with quizzes and revision tools.' },
  '/test-series': { title: 'CBSE Commerce Test Series', description: 'Practice Class 11 and 12 Commerce with chapter-wise tests, saved progress and Pro access.' },
  '/daily-practice': { title: 'Daily 10 Commerce Practice', description: 'Daily CBSE Commerce questions with a streak, Mistake Book and Weak Topic Radar.' },
  '/study-coach': { title: 'Commerce Study Coach & Chapter Mastery', description: 'See your chapter mastery, weakest areas and a personalized study mission based on your Commerce practice history.' },
  '/live-classes': { title: 'CBSE Commerce Live Classes', description: 'Learn about live CBSE Commerce classes.' },
  '/online-batch': { title: 'Online CBSE Commerce Coaching', description: 'Online CBSE Commerce coaching for Class 11 and 12.' },
  '/offline-batch': { title: 'Offline Commerce Coaching in Mehsana', description: 'Offline CBSE Commerce coaching in Mehsana, Gujarat.' },
  '/about': { title: 'About Smit Sir — Commerce Teacher Mehsana', description: 'Learn about Smit Sir Commerce and the teaching approach.' },
  '/contact': { title: 'Contact Smit Sir Commerce', description: 'Contact Smit Sir Commerce or book a free demo class.' },
  '/faq': { title: 'CBSE Commerce Coaching FAQ', description: 'Answers about subjects, resources, batches and demo classes.' },
  '/games': { title: 'Commerce Learning Games', description: 'Interactive Commerce learning games.' },
  '/flashcards': { title: 'Commerce Flashcards', description: 'Review Commerce concepts with interactive flashcards.' },
  '/ask': { title: 'Ask a Commerce Doubt', description: 'Ask questions about CBSE Commerce concepts.' },
  '/parent-info': { title: 'Information for Parents', description: 'Information for parents about classes and support.' },
  '/login': { title: 'Student Login', description: 'Student login.', noindex: true },
  '/admin': { title: 'Admin', description: 'Administrative area.', noindex: true },
  '/dashboard': { title: 'Student Dashboard', description: 'Private dashboard.', noindex: true },
  '/pdf-viewer': { title: 'PDF Viewer', description: 'View a study material PDF.', noindex: true },
  '/reel': { title: 'Reel Generator', description: 'Private tool.', noindex: true },
};
function RouteSEO() {
  const { pathname } = useLocation();
  if (pathname === '/cbse-notes' || pathname.startsWith('/cbse/')) return null;
  const meta = ROUTE_SEO[pathname] || { title: 'Page Not Found', description: 'The requested page could not be found.', noindex: true };
  return <SEO {...meta} path={pathname} />;
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTopOnNav />
      <Routes location={location}>
          <Route path="/admin" element={<Suspense fallback={<PageFallback />}><PageTransition><AdminDashboard /></PageTransition></Suspense>} />
          <Route path="/login" element={<Suspense fallback={<PageFallback />}><PageTransition><Login /></PageTransition></Suspense>} />
          <Route element={<Layout><Outlet /></Layout>}>
            <Route path="/" element={<Suspense fallback={<PageFallback />}><PageTransition><Home /></PageTransition></Suspense>} />
            <Route path="/courses" element={<Suspense fallback={<PageFallback />}><PageTransition><Courses /></PageTransition></Suspense>} />
            <Route path="/lectures" element={<Suspense fallback={<PageFallback />}><PageTransition><Lectures /></PageTransition></Suspense>} />
            <Route path="/study-material" element={<Suspense fallback={<PageFallback />}><PageTransition><StudyMaterial /></PageTransition></Suspense>} />
            <Route path="/pdf-viewer" element={<Suspense fallback={<PageFallback />}><PageTransition><PdfViewer /></PageTransition></Suspense>} />
            <Route path="/cbse-notes" element={<Suspense fallback={<PageFallback />}><PageTransition><CbseNotes /></PageTransition></Suspense>} />
            <Route path="/cbse/:classSlug/:hubSlug" element={<Suspense fallback={<PageFallback />}><PageTransition><SeoMaterialHub /></PageTransition></Suspense>} />
            <Route path="/cbse/:classSlug/:subjectSlug/:chapterSlug" element={<Suspense fallback={<PageFallback />}><PageTransition><SeoMaterialChapter /></PageTransition></Suspense>} />
            <Route path="/quizzes" element={<Suspense fallback={<PageFallback />}><PageTransition><Quizzes /></PageTransition></Suspense>} />
            <Route path="/test-series" element={<Suspense fallback={<PageFallback />}><PageTransition><TestSeries /></PageTransition></Suspense>} />
            <Route path="/daily-practice" element={<Suspense fallback={<PageFallback />}><PageTransition><DailyPractice /></PageTransition></Suspense>} />
            <Route path="/study-coach" element={<Suspense fallback={<PageFallback />}><PageTransition><StudyCoach /></PageTransition></Suspense>} />
            <Route path="/live-classes" element={<Suspense fallback={<PageFallback />}><PageTransition><LiveClasses /></PageTransition></Suspense>} />
            <Route path="/online-batch" element={<Suspense fallback={<PageFallback />}><PageTransition><BatchPage type="online" /></PageTransition></Suspense>} />
            <Route path="/offline-batch" element={<Suspense fallback={<PageFallback />}><PageTransition><BatchPage type="offline" /></PageTransition></Suspense>} />
            <Route path="/dashboard" element={<Suspense fallback={<PageFallback />}><PageTransition><StudentDashboard /></PageTransition></Suspense>} />
            <Route path="/parent-info" element={<Suspense fallback={<PageFallback />}><PageTransition><ParentInfo /></PageTransition></Suspense>} />
            <Route path="/about" element={<Suspense fallback={<PageFallback />}><PageTransition><About /></PageTransition></Suspense>} />
            <Route path="/contact" element={<Suspense fallback={<PageFallback />}><PageTransition><Contact /></PageTransition></Suspense>} />
            <Route path="/faq" element={<Suspense fallback={<PageFallback />}><PageTransition><FAQ /></PageTransition></Suspense>} />
            <Route path="/games" element={<Suspense fallback={<PageFallback />}><PageTransition><Games /></PageTransition></Suspense>} />
            <Route path="/flashcards" element={<Suspense fallback={<PageFallback />}><PageTransition><Flashcards /></PageTransition></Suspense>} />
            <Route path="/ask" element={<Suspense fallback={<PageFallback />}><PageTransition><AskDoubt /></PageTransition></Suspense>} />
            <Route path="/reel" element={<Suspense fallback={<PageFallback />}><PageTransition><ReelGenerator /></PageTransition></Suspense>} />
            <Route path="*" element={<Suspense fallback={<PageFallback />}><PageTransition><NotFound /></PageTransition></Suspense>} />
          </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LazyMotion features={domAnimation}>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AuthProvider>
            <RouteSEO />
            <AnimatedRoutes />
            <InstallPWA />
          </AuthProvider>
        </BrowserRouter>
      </LazyMotion>
    </HelmetProvider>
  );
}
