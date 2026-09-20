import { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation, Link, Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout";

const Premium = lazy(() => import("../pages/Premium"));
const PremiumEconomics = lazy(() => import("../pages/PremiumEconomics"));
const PremiumAccountancy = lazy(() => import("../pages/PremiumAccountancy"));
const Cbse12AccountancyPremium = lazy(() => import("../pages/Cbse12AccountancyPremium"));\nconst Cbse12BusinessStudiesPremium = lazy(() => import("../pages/Cbse12BusinessStudiesPremium"));
const MyPurchases = lazy(() => import("../pages/MyPurchases"));
const PurchaseStatus = lazy(() => import("../pages/PurchaseStatus"));
const QuizChapter = lazy(() => import("../pages/QuizChapter"));
import Home from "../pages/Home";
const TeacherGuidesHub = lazy(() => import("../pages/TeacherGuidesHub"));
const TeacherServices = lazy(() => import("../pages/TeacherServices"));
const BoardExamDiagnostic = lazy(() => import("../pages/BoardExamDiagnostic"));
const BoardBoosterPacks = lazy(() => import("../pages/BoardBoosterPacks"));
const Login = lazy(() => import("../pages/Login"));
const Onboarding = lazy(() => import("../pages/Onboarding"));
const Courses = lazy(() => import("../pages/Courses"));
const Lectures = lazy(() => import("../pages/Lectures"));
const StudyMaterial = lazy(() => import("../pages/StudyMaterial"));
const GsebClass11AccountancyNotes = lazy(
  () => import("../pages/GsebClass11AccountancyNotes"),
);
const PdfViewer = lazy(() => import("../pages/PdfViewer"));
const SeoMaterialHub = lazy(() => import("../pages/SeoMaterialHub"));
const SeoMaterialChapter = lazy(() => import("../pages/SeoMaterialChapter"));
const CbseNotes = lazy(() => import("../pages/CbseNotes"));
const ContentGrowthHub = lazy(() => import("../pages/ContentGrowthHub"));
const ContentGrowthPage = lazy(() => import("../pages/ContentGrowthPage"));
const AuthorityGuide = lazy(() => import("../pages/AuthorityGuide"));
const PyqHub = lazy(() => import("../pages/PyqHub"));
const Quizzes = lazy(() => import("../pages/Quizzes"));
const ExamMode = lazy(() => import("../pages/ExamMode"));
const ExamTestLanding = lazy(() => import("../pages/ExamTestLanding"));
const DailyPractice = lazy(() => import("../pages/DailyPractice"));
const StudyCoach = lazy(() => import("../pages/StudyCoach"));
const StudyTools = lazy(() => import("../pages/StudyTools"));
const CommerceToolsHub = lazy(() => import("../pages/CommerceToolsHub"));
const CommerceToolPage = lazy(() => import("../pages/CommerceToolPage"));
const ToolTopicCluster = lazy(() => import("../pages/ToolTopicCluster"));
const MarksRecovery = lazy(() => import("../pages/MarksRecovery"));
const LearningInsights = lazy(() => import("../pages/LearningInsights"));
const DataCenter = lazy(() => import("../pages/DataCenter"));
const LiveClasses = lazy(() => import("../pages/LiveClasses"));
const BatchPage = lazy(() => import("../pages/BatchPage"));
const StudentDashboard = lazy(() => import("../pages/StudentDashboard"));
const OwnerHome = lazy(() => import("../pages/OwnerHome"));
const AdminDashboard = lazy(() => import("../pages/AdminDashboard"));
const AdminStudio = lazy(() => import("../pages/AdminStudio"));
const LeadCRM = lazy(() => import("../pages/LeadCRM"));
const DemoScheduler = lazy(() => import("../pages/DemoScheduler"));
const GrowthLaunchKit = lazy(() => import("../pages/GrowthLaunchKit"));
const BookDemo = lazy(() => import("../pages/BookDemo"));
const FreeStudyPack = lazy(() => import("../pages/FreeStudyPack"));
const DemoSuccess = lazy(() => import("../pages/DemoSuccess"));
const Games = lazy(() => import("../pages/Games"));
const ConceptLab = lazy(() => import("../pages/ConceptLab"));
const Flashcards = lazy(() => import("../pages/Flashcards"));
const AskDoubt = lazy(() => import("../pages/AskDoubt"));
const ReelGenerator = lazy(() => import("../pages/ReelGenerator"));
const ParentInfo = lazy(() => import("../pages/ParentInfo"));
const About = lazy(() => import("../pages/About"));
const Contact = lazy(() => import("../pages/Contact"));
const FAQ = lazy(() => import("../pages/FAQ"));
const Legal = lazy(() => import("../pages/Legal"));
const CommerceCoachingMehsana = lazy(
  () => import("../pages/CommerceCoachingMehsana"),
);
const LocalSeoLanding = lazy(() => import("../pages/LocalSeoLanding"));
const LocalizedPilotPage = lazy(() => import("../pages/LocalizedPilotPage"));
const CommerceExpansion = lazy(() => import("../pages/CommerceExpansion"));
const CommerceDiscoveryPage = lazy(
  () => import("../pages/CommerceDiscoveryPage"),
);
const CommerceResourcePage = lazy(() => import("../pages/CommerceResourcePage"));
function ScrollToTopOnNav() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12" style={{ background: "var(--bg-ivory)" }}>
      <div className="card-paper w-full max-w-2xl p-7 sm:p-10 text-center">
        <span className="eyebrow">Smit Sir Commerce</span>
        <div className="text-7xl sm:text-8xl font-bold mt-5" style={{ color: "var(--gold)" }}>404</div>
        <h1 className="text-3xl sm:text-4xl mt-3" style={{ fontFamily: "var(--font-serif)", color: "var(--ink)" }}>This page could not be found.</h1>
        <p className="mt-4 mx-auto max-w-lg leading-7" style={{ color: "var(--muted)" }}>
          The link may be old, but your learning resources are still here. Choose where you want to continue.
        </p>
        <div className="grid sm:grid-cols-3 gap-3 mt-7">
          <Link to="/study-material" className="btn-primary">Open Notes</Link>
          <Link to="/quizzes" className="btn-outline-ink">Take a Quiz</Link>
          <Link to="/test-series" className="btn-outline-ink">View Tests</Link>
        </div>
        <Link to="/" className="inline-flex mt-6 text-sm font-bold" style={{ color: "var(--gold)" }}>
          Back to home
        </Link>
      </div>
    </div>
  );
}
function PageFallback() {
  return (
    <div className="ssc-page-fallback" role="status" aria-live="polite">
      <div className="ssc-page-fallback-card">
        <div className="ssc-page-fallback-top">
          <span className="ssc-page-fallback-spinner" aria-hidden="true" />
          <span className="ssc-page-fallback-copy">
            <strong>Opening your study page…</strong>
            <span>Just a moment.</span>
          </span>
        </div>
        <div className="ssc-page-fallback-lines" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
      </div>
    </div>
  );
}

const withPage = (node) => (
  <Suspense fallback={<PageFallback />}>{node}</Suspense>
);
function AnimatedRoutes() {
  const location = useLocation();
  return (
    <>
      <ScrollToTopOnNav />
      <Routes location={location}>
        <Route path="/admin" element={withPage(<OwnerHome />)} />
        <Route path="/admin/students" element={withPage(<AdminDashboard />)} />
        <Route path="/admin/leads" element={withPage(<LeadCRM />)} />
        <Route path="/admin/demos" element={withPage(<DemoScheduler />)} />
        <Route path="/admin/growth" element={withPage(<GrowthLaunchKit />)} />
        <Route path="/admin-studio" element={withPage(<AdminStudio />)} />
        <Route path="/login" element={withPage(<Login />)} />
        <Route
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="/" element={withPage(<Home />)} />
          <Route path="/onboarding" element={withPage(<Onboarding />)} />
          <Route
            path="/commerce-learning"
            element={withPage(<CommerceExpansion />)}
          />
          <Route
            path="/college-commerce"
            element={withPage(<CommerceExpansion />)}
          />
          <Route
            path="/college-commerce/bcom"
            element={withPage(<CommerceExpansion />)}
          />
          <Route
            path="/college-commerce/mcom"
            element={withPage(<CommerceExpansion />)}
          />
          <Route
            path="/commerce-exams"
            element={withPage(<CommerceExpansion />)}
          />
          <Route
            path="/ugc-net-commerce"
            element={withPage(<CommerceExpansion />)}
          />
          <Route
            path="/gset-commerce"
            element={withPage(<CommerceExpansion />)}
          />
          <Route
            path="/college/:universitySlug/:degreeSlug"
            element={withPage(<CommerceDiscoveryPage />)}
          />
          <Route
            path="/college/:universitySlug/:degreeSlug/:semesterSlug"
            element={withPage(<CommerceDiscoveryPage />)}
          />
          <Route
            path="/college/:universitySlug/:degreeSlug/:semesterSlug/:subjectSlug"
            element={withPage(<CommerceDiscoveryPage />)}
          />
          <Route
            path="/college/:universitySlug/:degreeSlug/:semesterSlug/:subjectSlug/:resourceSlug"
            element={withPage(<CommerceResourcePage />)}
          />
          <Route
            path="/competitive/:examSlug/:unitSlug"
            element={withPage(<CommerceDiscoveryPage />)}
          />
          <Route
            path="/competitive/:examSlug/:unitSlug/:resourceSlug"
            element={withPage(<CommerceResourcePage />)}
          />
          <Route
            path="/school-resource/:boardSlug/:classSlug/:subjectSlug/:resourceSlug"
            element={withPage(<CommerceResourcePage />)}
          />
          <Route path="/courses" element={withPage(<Courses />)} />
          <Route path="/lectures" element={withPage(<Lectures />)} />
          <Route path="/study-material" element={withPage(<StudyMaterial />)} />
          <Route
            path="/gseb-class-11-accountancy-notes"
            element={withPage(<GsebClass11AccountancyNotes />)}
          />
          <Route
            path="/teacher-guides"
            element={withPage(<TeacherGuidesHub />)}
          />
          <Route
            path="/services-for-teachers"
            element={withPage(<TeacherServices />)}
          />
          <Route
            path="/board-exam-diagnostic"
            element={withPage(<BoardExamDiagnostic />)}
          />
          <Route
            path="/board-booster-packs"
            element={withPage(<BoardBoosterPacks />)}
          />
          <Route
            path="/cbse/class-12/business-studies-diagnostic-test"
            element={withPage(<BoardExamDiagnostic />)}
          />
          <Route
            path="/cbse/class-12/economics-diagnostic-test"
            element={withPage(<BoardExamDiagnostic />)}
          />
          <Route
            path="/gseb/class-12/economics-diagnostic-test"
            element={withPage(<BoardExamDiagnostic />)}
          />
          <Route path="/pdf-viewer" element={withPage(<PdfViewer />)} />
          <Route path="/cbse-notes" element={withPage(<CbseNotes />)} />
          <Route
            path="/cbse-practice"
            element={withPage(<ContentGrowthHub />)}
          />
          <Route path="/cbse-pyq" element={withPage(<PyqHub />)} />
          <Route
            path="/cbse/class-12/business-studies-important-questions"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/business-studies-case-study-questions"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/business-studies-mcq"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-11/microeconomics-important-questions"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-11/economics-numericals"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/economics-revision-guide"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/economics-national-income-numericals"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/business-studies-case-study-keywords"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-11/demand-vs-quantity-demanded"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/gseb/class-12/economics-complete-revision-guide"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/gseb/class-12/money-inflation-common-mistakes"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/gseb/class-12/banking-monetary-policy-explained"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/gseb/class-12/economics-answer-writing-3-4-marks"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/gseb/class-12/economics-25-important-questions"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/gseb/class-12/economics-formula-diagram-sheet"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/national-income-numericals-beginner-to-board"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/national-income-common-mistakes"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/business-studies-case-study-master-guide"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/business-studies-case-study-keywords-teacher-list"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/cbse/class-12/business-studies-6-mark-answer-writing"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/class-12-commerce-7-day-revision-plan"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/class-12-commerce-30-day-revision-plan"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/class-12-economics-where-marks-are-lost"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/class-12-economics-formula-diagram-master-sheet"
            element={withPage(<AuthorityGuide />)}
          />
          <Route
            path="/practice/cbse/:classSlug/:subjectSlug/:practiceSlug"
            element={withPage(<ContentGrowthPage />)}
          />
          <Route
            path="/cbse/:classSlug/:hubSlug"
            element={withPage(<SeoMaterialHub />)}
          />
          <Route
            path="/cbse/:classSlug/:subjectSlug/:chapterSlug"
            element={withPage(<SeoMaterialChapter />)}
          />
          <Route path="/quizzes" element={withPage(<Quizzes />)} />
          <Route path="/premium" element={withPage(<Premium />)} />
          <Route
            path="/premium/economics"
            element={withPage(<PremiumEconomics />)}
          />
          <Route
            path="/premium/accountancy"
            element={withPage(<PremiumAccountancy />)}
          />
          <Route
            path="/premium/cbse-12-accountancy"
            element={withPage(<Cbse12AccountancyPremium />)}
          />
          <Route
            path="/premium/cbse-12-business-studies"
            element={withPage(<Cbse12BusinessStudiesPremium />)}
          />
          <Route
            path="/economics-quizzes/:classSlug/:chapterSlug"
            element={withPage(<QuizChapter />)}
          />
          <Route
            path="/gseb-economics-quizzes/:classSlug/:chapterSlug"
            element={withPage(<QuizChapter />)}
          />
          <Route path="/exam-mode" element={withPage(<ExamMode />)} />
          <Route
            path="/tests/:testSlug"
            element={withPage(<ExamTestLanding />)}
          />
          <Route path="/daily-practice" element={withPage(<DailyPractice />)} />
          <Route path="/study-coach" element={withPage(<StudyCoach />)} />
          <Route path="/study-tools" element={withPage(<StudyTools />)} />
          <Route path="/marks-recovery" element={withPage(<MarksRecovery />)} />
          <Route path="/tools" element={withPage(<CommerceToolsHub />)} />
          <Route
            path="/tools/topics/:clusterSlug"
            element={withPage(<ToolTopicCluster />)}
          />
          <Route
            path="/tools/:toolSlug"
            element={withPage(<CommerceToolPage />)}
          />
          <Route
            path="/learning-insights"
            element={withPage(<LearningInsights />)}
          />
          <Route path="/my-data" element={withPage(<DataCenter />)} />
          <Route path="/live-classes" element={withPage(<LiveClasses />)} />
          <Route
            path="/commerce-coaching-mehsana"
            element={withPage(<CommerceCoachingMehsana />)}
          />
          <Route
            path="/cbse-commerce-classes-mehsana"
            element={withPage(<LocalSeoLanding />)}
          />
          <Route
            path="/class-11-commerce-tuition-mehsana"
            element={withPage(<LocalSeoLanding />)}
          />
          <Route
            path="/class-12-commerce-tuition-mehsana"
            element={withPage(<LocalSeoLanding />)}
          />
          <Route
            path="/economics-tuition-mehsana"
            element={withPage(<LocalSeoLanding />)}
          />
          <Route
            path="/gseb-economics-tuition-mehsana"
            element={withPage(<LocalSeoLanding />)}
          />
          <Route
            path="/business-studies-tuition-mehsana"
            element={withPage(<LocalSeoLanding />)}
          />
          <Route
            path="/online-batch"
            element={withPage(<BatchPage type="online" />)}
          />
          <Route
            path="/offline-batch"
            element={withPage(<BatchPage type="offline" />)}
          />
          <Route path="/dashboard" element={withPage(<StudentDashboard />)} />
          <Route path="/my-purchases" element={withPage(<MyPurchases />)} />
          <Route path="/purchase-status" element={withPage(<PurchaseStatus />)} />
          <Route path="/book-demo" element={withPage(<BookDemo />)} />
          <Route
            path="/free-commerce-study-pack"
            element={withPage(<FreeStudyPack />)}
          />
          <Route path="/demo-success" element={withPage(<DemoSuccess />)} />
          <Route path="/parent-info" element={withPage(<ParentInfo />)} />
          <Route path="/about" element={withPage(<About />)} />
          <Route path="/contact" element={withPage(<Contact />)} />
          <Route path="/faq" element={withPage(<FAQ />)} />
          <Route path="/privacy" element={withPage(<Legal />)} />
          <Route path="/terms" element={withPage(<Legal />)} />
          <Route path="/access-policy" element={withPage(<Legal />)} />
          <Route path="/disclaimer" element={withPage(<Legal />)} />
          <Route path="/content-provenance" element={withPage(<Legal />)} />
          <Route path="/concept-lab" element={withPage(<ConceptLab />)} />
          <Route path="/games" element={withPage(<Games />)} />
          <Route path="/flashcards" element={withPage(<Flashcards />)} />
          <Route path="/ask" element={withPage(<AskDoubt />)} />
          <Route path="/reel" element={withPage(<ReelGenerator />)} />
          <Route path="/hi/*" element={withPage(<LocalizedPilotPage />)} />
          <Route path="/gu/*" element={withPage(<LocalizedPilotPage />)} />
          <Route path="*" element={withPage(<NotFound />)} />
        </Route>
      </Routes>
    </>
  );
}

export { AnimatedRoutes };
