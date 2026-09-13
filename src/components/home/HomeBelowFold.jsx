import CommerceJourneyPreview from "./CommerceJourneyPreview";
import LearningPhilosophy from "./LearningPhilosophy";
import TrustLayer from "./TrustLayer";
import MehsanaGrowthCampaign from "./MehsanaGrowthCampaign";
import SeoDiscoveryLinks from "./SeoDiscoveryLinks";
import CommerceToolsPreview from "./CommerceToolsPreview";
import MarksRecoveryCTA from "./MarksRecoveryCTA";
import StatsSection from "./StatsSection";
import CoursesPreview from "./CoursesPreview";
import AboutSection from "./AboutSection";
import FreeResources from "./FreeResources";
import DailyPracticeCTA from "./DailyPracticeCTA";
import StudyCoachCTA from "./StudyCoachCTA";
import BatchCTA from "./BatchCTA";
import FAQSection from "./FAQSection";
import ContactCTA from "./ContactCTA";
import StudentJourney from "./StudentJourney";
import SectionDivider from "../ui/SectionDivider";
import TeacherStudioPromo from "./TeacherStudioPromo";
import { Pricing } from "../ui/pricing";
import LogosSlider from "./LogosSlider";
import ConceptLabPromo from "./ConceptLabPromo";
import BoardBoosterPromo from "./BoardBoosterPromo";
import PremiumSpotlight from "./PremiumSpotlight";
import QuizPromo from "./QuizPromo";

const studentPlans = [
  {
    name: "Free Learning",
    price: 0,
    period: "forever",
    eyebrow: "START HERE",
    description: "A complete starting point for Commerce students—no payment required.",
    features: [
      "Published chapter-wise notes",
      "Easy and Moderate quizzes",
      "Free study tools and diagnostics",
      "No account needed for free PDFs",
    ],
    buttonText: "Explore free resources",
    href: "/study-material",
    isPopular: false,
  },
  {
    name: "Board Booster",
    price: 199,
    period: "one-time",
    eyebrow: "EXAM FOCUS",
    description: "A focused seven-day revision pack for one selected board subject.",
    features: [
      "Original 14-page revision pack",
      "Three exam-style tests with answers",
      "Weak-topic worksheet",
      "Seven-day revision plan",
    ],
    buttonText: "View Board Boosters",
    href: "/board-booster-packs",
    isPopular: true,
  },
  {
    name: "Premium Economics",
    price: 999,
    period: "lifetime",
    eyebrow: "DEEP PRACTICE",
    description: "Advanced Economics practice for students who want harder preparation.",
    features: [
      "Hard and Extreme Economics quizzes",
      "31 chapter deep-dive guides",
      "620 worked challenges",
      "One account with lifetime access",
    ],
    buttonText: "See Premium details",
    href: "/premium",
    isPopular: false,
  },
];

export default function HomeBelowFold() {
  return (
    <div className="ssc-home-modules">
      <ConceptLabPromo />
      <BoardBoosterPromo />
      <PremiumSpotlight />
      <QuizPromo />
      <CommerceJourneyPreview />
      <LearningPhilosophy />
      <TrustLayer />
      <LogosSlider />
      <TeacherStudioPromo />
      <MehsanaGrowthCampaign />
      <MarksRecoveryCTA />
      <CommerceToolsPreview />
      <SeoDiscoveryLinks />
      <StatsSection />
      <StudentJourney />
      <DailyPracticeCTA />
      <StudyCoachCTA />
      <CoursesPreview />
      <SectionDivider />
      <AboutSection />
      <FreeResources />
      <Pricing
        plans={studentPlans}
        title="Free first. Upgrade only when useful."
        description="Every option is clear, student-friendly and paid only once—there are no monthly subscriptions."
      />
      <BatchCTA />
      <SectionDivider />
      <FAQSection />
      <ContactCTA />
    </div>
  );
}
