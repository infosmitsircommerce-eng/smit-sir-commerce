import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Link, Outlet } from 'react-router-dom';
import { AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import InstallPWA from './components/ui/InstallPWA';
import Layout from './components/layout/Layout';
import PageTransition from './components/ui/PageTransition';
import { AuthProvider } from './context/AuthContext';

// Code-split every page — only loads what the user visits
const Home            = lazy(() => import('./pages/Home'));
const Login           = lazy(() => import('./pages/Login'));
const Courses         = lazy(() => import('./pages/Courses'));
const Lectures        = lazy(() => import('./pages/Lectures'));
const StudyMaterial   = lazy(() => import('./pages/StudyMaterial'));
const Quizzes         = lazy(() => import('./pages/Quizzes'));
const TestSeries      = lazy(() => import('./pages/TestSeries'));
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

// Minimal fallback while a lazy page chunk loads
function PageFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-950">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-gold-500/30 border-t-gold-400 animate-spin" />
        <p className="text-navy-500 text-sm">Loading…</p>
      </div>
    </div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <>
      <ScrollToTopOnNav />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/admin" element={
            <Suspense fallback={<PageFallback />}>
              <PageTransition><AdminDashboard /></PageTransition>
            </Suspense>
          } />
          <Route path="/login" element={
            <Suspense fallback={<PageFallback />}>
              <PageTransition><Login /></PageTransition>
            </Suspense>
          } />
          <Route element={
            <Layout>
              <Outlet />
            </Layout>
          }>
            <Route path="/" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><Home /></PageTransition>
              </Suspense>
            } />
            <Route path="/courses" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><Courses /></PageTransition>
              </Suspense>
            } />
            <Route path="/lectures" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><Lectures /></PageTransition>
              </Suspense>
            } />
            <Route path="/study-material" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><StudyMaterial /></PageTransition>
              </Suspense>
            } />
            <Route path="/quizzes" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><Quizzes /></PageTransition>
              </Suspense>
            } />
            <Route path="/test-series" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><TestSeries /></PageTransition>
              </Suspense>
            } />
            <Route path="/live-classes" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><LiveClasses /></PageTransition>
              </Suspense>
            } />
            <Route path="/online-batch" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><BatchPage type="online" /></PageTransition>
              </Suspense>
            } />
            <Route path="/offline-batch" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><BatchPage type="offline" /></PageTransition>
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><StudentDashboard /></PageTransition>
              </Suspense>
            } />
            <Route path="/parent-info" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><ParentInfo /></PageTransition>
              </Suspense>
            } />
            <Route path="/about" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><About /></PageTransition>
              </Suspense>
            } />
            <Route path="/contact" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><Contact /></PageTransition>
              </Suspense>
            } />
            <Route path="/faq" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><FAQ /></PageTransition>
              </Suspense>
            } />
            <Route path="/games" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><Games /></PageTransition>
              </Suspense>
            } />
            <Route path="/flashcards" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><Flashcards /></PageTransition>
              </Suspense>
            } />
            <Route path="/ask" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><AskDoubt /></PageTransition>
              </Suspense>
            } />
            <Route path="/reel" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><ReelGenerator /></PageTransition>
              </Suspense>
            } />
            <Route path="*" element={
              <Suspense fallback={<PageFallback />}>
                <PageTransition><NotFound /></PageTransition>
              </Suspense>
            } />
          </Route>
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <LazyMotion features={domAnimation}>
        <BrowserRouter>
          <AuthProvider>
            <AnimatedRoutes />
            <InstallPWA />
          </AuthProvider>
        </BrowserRouter>
      </LazyMotion>
    </HelmetProvider>
  );
}
